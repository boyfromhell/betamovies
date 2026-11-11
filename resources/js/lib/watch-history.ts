export type WatchHistoryType = 'movie' | 'tv';

export type WatchHistoryEntry = {
    showId: number;
    mediaId: number;
    type: WatchHistoryType;
    title: string;
    slug: string;
    posterPath: string | null;
    lastSelectedSeason: number | null;
    lastSelectedEpisode: number | null;
    lastWatchedSeason: number | null;
    lastWatchedEpisode: number | null;
    watchedEpisodes: string[];
    updatedAt: number;
};

type RecordWatchInput = {
    mediaId: number;
    type: WatchHistoryType;
    title: string;
    slug: string;
    posterPath: string | null;
    season?: number | null;
    episode?: number | null;
};

const databaseName = 'guest_watch_history';
const databaseVersion = 1;
const storeName = 'shows';
const updateEventName = 'guest-watch-history-updated';
const movieHistoryIdOffset = 1_000_000_000;

let databasePromise: Promise<IDBDatabase> | null = null;
let updateChannel: BroadcastChannel | null = null;

const positiveInteger = (value: unknown): number | null => {
    const integer = Number(value);

    return Number.isInteger(integer) && integer > 0 ? integer : null;
};

const historyStoreId = (
    type: WatchHistoryType,
    mediaId: number,
): number | null => {
    const normalizedMediaId = positiveInteger(mediaId);

    if (normalizedMediaId === null) {
        return null;
    }

    return type === 'movie'
        ? movieHistoryIdOffset + normalizedMediaId
        : normalizedMediaId;
};

const requestResult = <Result>(request: IDBRequest<Result>): Promise<Result> =>
    new Promise((resolve, reject) => {
        request.addEventListener('success', () => resolve(request.result));
        request.addEventListener('error', () =>
            reject(request.error ?? new Error('IndexedDB request failed.')),
        );
    });

const openDatabase = (): Promise<IDBDatabase> => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
        return Promise.reject(new Error('IndexedDB is not available.'));
    }

    if (databasePromise !== null) {
        return databasePromise;
    }

    databasePromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(databaseName, databaseVersion);

        request.addEventListener('upgradeneeded', () => {
            if (!request.result.objectStoreNames.contains(storeName)) {
                const store = request.result.createObjectStore(storeName, {
                    keyPath: 'showId',
                });

                store.createIndex('updatedAt', 'updatedAt');
            }
        });
        request.addEventListener('success', () => resolve(request.result));
        request.addEventListener('error', () =>
            reject(request.error ?? new Error('Could not open IndexedDB.')),
        );
    });

    return databasePromise;
};

const withStore = async <Result>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => Promise<Result>,
): Promise<Result> => {
    const database = await openDatabase();
    const transaction = database.transaction(storeName, mode);

    return callback(transaction.objectStore(storeName));
};

const slugify = (value: string): string => {
    const slug = value
        .toLocaleLowerCase('ro')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return slug || 'title';
};

const sanitizeEntry = (value: unknown): WatchHistoryEntry | null => {
    if (typeof value !== 'object' || value === null) {
        return null;
    }

    const entry = value as Partial<WatchHistoryEntry>;
    const type: WatchHistoryType = entry.type === 'movie' ? 'movie' : 'tv';
    const mediaId = positiveInteger(entry.mediaId ?? entry.showId);

    if (mediaId === null) {
        return null;
    }

    const showId = historyStoreId(type, mediaId);
    const title =
        typeof entry.title === 'string' && entry.title.trim()
            ? entry.title.trim()
            : type === 'movie'
              ? 'Untitled movie'
              : 'Untitled TV show';
    const watchedEpisodes = Array.isArray(entry.watchedEpisodes)
        ? [
              ...new Set(
                  entry.watchedEpisodes.filter(
                      (episode): episode is string =>
                          typeof episode === 'string' &&
                          /^\d+-\d+$/.test(episode),
                  ),
              ),
          ]
        : [];

    if (showId === null) {
        return null;
    }

    return {
        showId,
        mediaId,
        type,
        title,
        slug:
            typeof entry.slug === 'string' && entry.slug
                ? entry.slug
                : slugify(title),
        posterPath:
            typeof entry.posterPath === 'string' ? entry.posterPath : null,
        lastSelectedSeason: positiveInteger(entry.lastSelectedSeason),
        lastSelectedEpisode: positiveInteger(entry.lastSelectedEpisode),
        lastWatchedSeason: positiveInteger(entry.lastWatchedSeason),
        lastWatchedEpisode: positiveInteger(entry.lastWatchedEpisode),
        watchedEpisodes,
        updatedAt:
            typeof entry.updatedAt === 'number' &&
            Number.isFinite(entry.updatedAt)
                ? entry.updatedAt
                : Date.now(),
    };
};

const broadcastUpdate = (): void => {
    window.dispatchEvent(new CustomEvent(updateEventName));
    channel()?.postMessage({ updated: true });
};

const channel = (): BroadcastChannel | null => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
        return null;
    }

    if (updateChannel === null) {
        updateChannel = new BroadcastChannel(updateEventName);
        updateChannel.addEventListener('message', () => {
            window.dispatchEvent(new CustomEvent(updateEventName));
        });
    }

    return updateChannel;
};

export const watchHistory = {
    async get(
        type: WatchHistoryType,
        mediaId: number,
    ): Promise<WatchHistoryEntry | null> {
        const showId = historyStoreId(type, mediaId);

        if (showId === null) {
            return null;
        }

        const stored = await withStore('readonly', (store) =>
            requestResult<unknown>(store.get(showId)),
        );

        return sanitizeEntry(stored);
    },

    async all(): Promise<WatchHistoryEntry[]> {
        const entries = await withStore('readonly', (store) =>
            requestResult<unknown[]>(store.getAll()),
        );

        return entries
            .map(sanitizeEntry)
            .filter((entry): entry is WatchHistoryEntry => entry !== null)
            .sort((first, second) => second.updatedAt - first.updatedAt);
    },

    async record(input: RecordWatchInput): Promise<void> {
        const showId = historyStoreId(input.type, input.mediaId);

        if (showId === null) {
            return;
        }

        const stored = await withStore('readonly', (store) =>
            requestResult<unknown>(store.get(showId)),
        );
        const existing = sanitizeEntry(stored);
        const season = positiveInteger(input.season);
        const episode = positiveInteger(input.episode);
        const entry = sanitizeEntry({
            ...existing,
            showId,
            mediaId: input.mediaId,
            type: input.type,
            title: input.title,
            slug: input.slug,
            posterPath: input.posterPath,
            lastSelectedSeason: season,
            lastSelectedEpisode: episode,
            lastWatchedSeason: existing?.lastWatchedSeason ?? null,
            lastWatchedEpisode: existing?.lastWatchedEpisode ?? null,
            watchedEpisodes: existing?.watchedEpisodes ?? [],
            updatedAt: Date.now(),
        });

        if (entry === null) {
            return;
        }

        await withStore('readwrite', (store) =>
            requestResult(store.put(entry)),
        );
        broadcastUpdate();
    },

    async markWatched(input: RecordWatchInput): Promise<void> {
        const showId = historyStoreId(input.type, input.mediaId);
        const season = positiveInteger(input.season);
        const episode = positiveInteger(input.episode);

        if (showId === null || season === null || episode === null) {
            return;
        }

        const stored = await withStore('readonly', (store) =>
            requestResult<unknown>(store.get(showId)),
        );
        const existing = sanitizeEntry(stored);
        const episodeKey = `${season}-${episode}`;
        const entry = sanitizeEntry({
            ...existing,
            showId,
            mediaId: input.mediaId,
            type: input.type,
            title: input.title,
            slug: input.slug,
            posterPath: input.posterPath,
            lastSelectedSeason: season,
            lastSelectedEpisode: episode,
            lastWatchedSeason: season,
            lastWatchedEpisode: episode,
            watchedEpisodes: [
                ...new Set([...(existing?.watchedEpisodes ?? []), episodeKey]),
            ],
            updatedAt: Date.now(),
        });

        if (entry === null) {
            return;
        }

        await withStore('readwrite', (store) =>
            requestResult(store.put(entry)),
        );
        broadcastUpdate();
    },

    async remove(entry: WatchHistoryEntry): Promise<void> {
        await withStore('readwrite', (store) =>
            requestResult(store.delete(entry.showId)),
        );
        broadcastUpdate();
    },

    async clear(): Promise<void> {
        await withStore('readwrite', (store) => requestResult(store.clear()));
        broadcastUpdate();
    },

    subscribe(callback: () => void): () => void {
        channel();
        window.addEventListener(updateEventName, callback);

        return () => window.removeEventListener(updateEventName, callback);
    },
};
