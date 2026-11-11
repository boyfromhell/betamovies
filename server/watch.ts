import {
    AppError,
    object,
    pick,
    rows,
    setting,
    text,
    type Environment,
    type JsonObject,
    type MediaType,
} from './types.ts';
import { Catalog } from './tmdb/catalog.ts';
import { Players } from './players.ts';
import { StateStore } from './state.ts';
import { cookie, setCookie, sign, verify, watchRedirect } from './security.ts';

export async function protectionEnabled(
    store: StateStore,
    env: Environment,
): Promise<boolean> {
    return (
        (await store.get<boolean>('watch-protection')) ??
        setting(env, 'WATCH_PROTECTION_ENABLED', 'true') !== 'false'
    );
}

export async function hasWatchAccess(
    request: Request,
    env: Environment,
): Promise<boolean> {
    return (await verify(env, cookie(request, 'bm_watch')))?.watch === true;
}

export async function verifyTurnstile(
    request: Request,
    env: Environment,
    input: JsonObject,
    http: typeof fetch = fetch,
): Promise<string> {
    const destination = watchRedirect(input.redirect);
    const token = text(input['cf-turnstile-response']);
    if (
        !token ||
        token.length > 4096 ||
        !setting(env, 'TURNSTILE_SECRET_KEY')
    ) {
        throw new AppError(
            422,
            'Cloudflare could not verify this request. Please try again.',
        );
    }
    const segments = destination.split('/');
    const expectedAction = `watch_${segments[1]}_${segments[2]}`;
    const testSecret =
        setting(env, 'TURNSTILE_SECRET_KEY') ===
        '1x0000000000000000000000000000000AA';
    const localTest =
        testSecret &&
        ['localhost', '127.0.0.1', '[::1]'].includes(
            new URL(request.url).hostname,
        ) &&
        setting(env, 'NODE_ENV') !== 'production' &&
        token === 'XXXX.DUMMY.TOKEN.XXXX';
    if (testSecret && !localTest) {
        throw new AppError(
            503,
            'Configure production Turnstile keys for this domain.',
        );
    }
    const response = await http(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000),
            body: JSON.stringify({
                secret: setting(env, 'TURNSTILE_SECRET_KEY'),
                response: token,
                idempotency_key: crypto.randomUUID(),
            }),
        },
    );
    if (!response.ok) {
        throw new AppError(
            503,
            'Verification is temporarily unavailable. Please try again.',
        );
    }
    const proof = object(await response.json());
    if (
        proof.success !== true ||
        (!localTest &&
            (proof.action !== expectedAction ||
                proof.hostname !== new URL(request.url).hostname ||
                !Number.isFinite(Date.parse(text(proof.challenge_ts))) ||
                Date.now() - Date.parse(text(proof.challenge_ts)) > 300000 ||
                Date.parse(text(proof.challenge_ts)) - Date.now() > 60000))
    ) {
        throw new AppError(
            422,
            'Cloudflare could not verify this request. Please try again.',
        );
    }
    const ttl = Math.max(
        60,
        Math.min(
            86400,
            (Number(setting(env, 'TURNSTILE_WATCH_TTL_MINUTES', '30')) || 30) *
                60,
        ),
    );
    return setCookie(
        request,
        'bm_watch',
        await sign(env, { watch: true }, ttl),
        ttl,
    );
}

export async function watchPage(
    catalog: Catalog,
    players: Players,
    type: MediaType,
    id: number,
    requestedSeason?: number,
    requestedEpisode?: number,
): Promise<JsonObject> {
    const media = await catalog.rawDetails(type, id);
    const mediaSlug = text(catalog.watchRoute(media, type).url).split('/')[3];
    const imdb = text(object(media.external_ids).imdb_id) || null;
    const payload = catalog.detailsPayload(media, type);
    if (type === 'movie') {
        return {
            media: payload,
            slug: mediaSlug,
            players: await players.sources(type, id, imdb),
        };
    }
    const latest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const aired = (item: JsonObject): boolean =>
        typeof item.air_date === 'string' &&
        item.air_date !== '' &&
        item.air_date <= latest;
    const seasons = rows(media.seasons).filter(
        (season) => Number(season.episode_count) > 0 && aired(season),
    );
    const selected =
        requestedSeason === undefined
            ? (seasons.find((season) => Number(season.season_number) > 0) ??
              seasons[0])
            : seasons.find(
                  (season) => Number(season.season_number) === requestedSeason,
              );
    if (requestedSeason !== undefined && !selected) {
        throw new AppError(404, 'This season has not aired yet.');
    }
    const seasonNumber = selected ? Number(selected.season_number) : null;
    const details =
        seasonNumber === null
            ? {}
            : await catalog.client.request(`/tv/${id}/season/${seasonNumber}`, {
                  language: catalog.language,
              });
    const episodes = rows(details.episodes)
        .filter(aired)
        .map((episode) =>
            pick(episode, [
                'id',
                'name',
                'overview',
                'episode_number',
                'air_date',
                'runtime',
                'still_path',
            ]),
        );
    const episode =
        requestedEpisode === undefined
            ? episodes[0]
            : episodes.find(
                  (item) => Number(item.episode_number) === requestedEpisode,
              );
    if (requestedEpisode !== undefined && !episode) {
        throw new AppError(404, 'This episode has not aired yet.');
    }
    const episodeNumber = episode ? Number(episode.episode_number) : null;
    return {
        media: payload,
        slug: mediaSlug,
        seasons: seasons.map((season) =>
            pick(season, [
                'id',
                'name',
                'season_number',
                'episode_count',
                'air_date',
            ]),
        ),
        episodes,
        selectedSeason: seasonNumber,
        selectedEpisode: episodeNumber,
        players:
            seasonNumber !== null && episodeNumber !== null
                ? await players.sources(
                      type,
                      id,
                      imdb,
                      seasonNumber,
                      episodeNumber,
                  )
                : [],
    };
}
