import {
    AppError,
    object,
    rows,
    setting,
    text,
    type Environment,
    type JsonObject,
    type MediaType,
} from '../types.ts';
import { StateStore } from '../state.ts';
import { decrypt, encrypt } from '../security.ts';
import { Catalog } from './catalog.ts';

export class Account {
    constructor(
        private catalog: Catalog,
        private store: StateStore,
        private env: Environment,
    ) {}
    async credentials(): Promise<JsonObject> {
        const stored = await this.store.get<string>('tmdb-credentials');
        if (stored) {
            return decrypt(this.env, stored);
        }
        return {
            accountId: Number(setting(this.env, 'TMDB_ACCOUNT_ID')),
            sessionId: setting(this.env, 'TMDB_SESSION_ID'),
            source: 'environment',
            username: null,
            connectedAt: null,
        };
    }
    async context(): Promise<{ id: number; session: string }> {
        const data = await this.credentials();
        const id = Number(data.accountId);
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new AppError(503, 'The TMDB account is not configured.');
        }
        return { id, session: text(data.sessionId) };
    }
    async status(): Promise<JsonObject> {
        const data = await this.credentials();
        return {
            connected: Boolean(data.sessionId),
            accountId: Number(data.accountId) || 0,
            username: data.username ?? null,
            connectedAt: data.connectedAt ?? null,
            source: data.source ?? null,
        };
    }
    async connect(sessionId: string): Promise<void> {
        this.store.requireDurable();
        const data = await this.catalog.client.request(
            '/account',
            { session_id: sessionId },
            { private: true },
        );
        if (!Number.isSafeInteger(data.id) || Number(data.id) < 1) {
            throw new AppError(502, 'TMDB did not return an account.');
        }
        await this.store.set(
            'tmdb-credentials',
            await encrypt(this.env, {
                accountId: data.id,
                sessionId,
                username: data.username ?? null,
                connectedAt: new Date().toISOString(),
                source: 'database',
            }),
        );
    }
    async disconnect(): Promise<void> {
        const stored = await this.store.get<string>('tmdb-credentials');
        if (stored) {
            const data = await decrypt(this.env, stored);
            await this.catalog.client.request(
                '/authentication/session',
                {},
                {
                    method: 'DELETE',
                    private: true,
                    body: { session_id: data.sessionId },
                },
            );
            await this.store.delete('tmdb-credentials');
        }
    }
    async list(
        kind: 'watchlist' | 'favorite' | 'rated',
        type: 'movies' | 'tv' | 'tv/episodes',
        page: number,
    ): Promise<JsonObject> {
        const { id, session } = await this.context();
        return this.catalog.paginated(
            await this.catalog.client.request(
                `/account/${id}/${kind}/${type}`,
                this.catalog.options({
                    session_id: session,
                    page,
                    sort_by: 'created_at.desc',
                }),
                { private: true },
            ),
        );
    }
    async watchlist(page: number): Promise<JsonObject> {
        const [movies, shows, movieGenres, tvGenres] = await Promise.all([
            this.list('watchlist', 'movies', page),
            this.list('watchlist', 'tv', page),
            this.catalog.genres('movie'),
            this.catalog.genres('tv'),
        ]);
        return {
            catalog: {
                items: [
                    ...rows(movies.items).map((item) =>
                        this.catalog.mapItem(item, 'movie', movieGenres),
                    ),
                    ...rows(shows.items).map((item) =>
                        this.catalog.mapItem(item, 'tv', tvGenres),
                    ),
                ],
                page,
                totalPages: Math.max(
                    Number(movies.totalPages),
                    Number(shows.totalPages),
                ),
                totalResults:
                    Number(movies.totalResults) + Number(shows.totalResults),
            },
            tmdbAvailable: true,
        };
    }
    async updateWatchlist(
        type: MediaType,
        id: number,
        watchlist: boolean,
    ): Promise<void> {
        const account = await this.context();
        await this.catalog.client.request(
            `/account/${account.id}/watchlist`,
            { session_id: account.session },
            {
                method: 'POST',
                private: true,
                body: { media_type: type, media_id: id, watchlist },
            },
        );
    }
    async watchlisted(type: MediaType, id: number): Promise<boolean> {
        const { session } = await this.context();
        return (
            (
                await this.catalog.client.request(
                    `/${type}/${id}/account_states`,
                    { session_id: session },
                    { private: true },
                )
            ).watchlist === true
        );
    }
    async scanEpisodes(): Promise<JsonObject[]> {
        const episodes = new Map<string, JsonObject>();
        const endedShows = new Set<number>();
        const earliest = new Date(Date.now() - 7 * 86400000)
            .toISOString()
            .slice(0, 10);
        const latest = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);
        let page = 1,
            totalPages = 1;
        do {
            const list = await this.list('watchlist', 'tv', page);
            totalPages = Number(list.totalPages) || 0;
            for (const item of rows(list.items)) {
                const show = await this.catalog.client.request(
                    `/tv/${Number(item.id)}`,
                    { language: this.catalog.language },
                );
                if (
                    rows(show.genres).some((genre) => genre.id === 16) &&
                    show.original_language === 'ja'
                ) {
                    continue;
                }
                if (show.status === 'Ended' || show.in_production === false) {
                    endedShows.add(Number(item.id));
                    continue;
                }
                for (const key of [
                    'last_episode_to_air',
                    'next_episode_to_air',
                ]) {
                    const episode = object(show[key]);
                    const date = text(episode.air_date);
                    if (
                        Number(episode.season_number) <= 0 ||
                        Number(episode.episode_number) <= 0 ||
                        !date ||
                        date < earliest ||
                        date > latest
                    ) {
                        continue;
                    }
                    episodes.set(
                        `${Number(item.id)}:${Number(episode.season_number)}:${Number(episode.episode_number)}`,
                        {
                            id: item.id,
                            name: show.name,
                            poster_path: show.poster_path ?? null,
                            season: episode.season_number,
                            episode: episode.episode_number,
                            title: text(episode.name),
                            overview: text(episode.overview),
                            air_date: date,
                        },
                    );
                }
            }
            page++;
        } while (page <= totalPages);
        for (const id of endedShows) {
            await this.updateWatchlist('tv', id, false);
        }
        const result = [...episodes.values()].sort((left, right) =>
            text(right.air_date).localeCompare(text(left.air_date)),
        );
        await this.store.set('recent-episodes', result);
        return result;
    }
}
