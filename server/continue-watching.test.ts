import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handle } from './app.ts';
import { StateStore } from './state.ts';
import { watchRedirect } from './security.ts';
import type { Environment, JsonObject } from './types.ts';

const origin = 'https://movies.example.test';
const currentPath = '/series/21/a-show/watch/1/1';
const resumePath = `${currentPath}?resume=next`;
const request = (path: string, init: RequestInit = {}) =>
    new Request(origin + path, {
        ...init,
        headers: new Headers([
            ['X-Inertia', 'true'],
            ...new Headers(init.headers),
        ]),
    });

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-11T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

function fixture() {
    const values = new Map<string, string>();
    const env: Environment = {
        TMDB_API_TOKEN: 'mock-token',
        TMDB_CACHE_SECONDS: '0',
        WATCH_PROTECTION_ENABLED: 'false',
        SESSION_SECRET: 'session-signing-secret-with-at-least-32-characters',
        STATE: {
            get: async (key) => values.get(key) ?? null,
            put: async (key, value) => {
                values.set(key, value);
            },
            delete: async (key) => {
                values.delete(key);
            },
        },
    };
    const series = {
        id: 21,
        name: 'A Show',
        seasons: [
            { season_number: 1, episode_count: 2, air_date: '2026-01-01' },
        ],
    };
    const episodes: Record<number, JsonObject[]> = {
        1: [
            { episode_number: 1, air_date: '2026-01-01' },
            { episode_number: 2, air_date: '2026-11-10' },
        ],
    };
    const http = vi.fn<typeof fetch>(async (input, init) => {
        const url = new URL(
            input instanceof Request ? input.url : String(input),
        );
        let data: unknown;
        if (
            url.href ===
            'https://challenges.cloudflare.com/turnstile/v0/siteverify'
        ) {
            data = {
                success: true,
                action: 'watch_series_21',
                hostname: 'movies.example.test',
                challenge_ts: '2026-11-11T12:00:00Z',
            };
        } else {
            expect(init?.method).toBe('GET');
            expect(new Headers(init?.headers).get('Authorization')).toBe(
                'Bearer mock-token',
            );
            expect(url.searchParams.get('language')).toBe('en-US');
            const season = url.pathname.match(/^\/3\/tv\/21\/season\/(\d+)$/);
            if (
                url.origin === 'https://api.themoviedb.org' &&
                url.pathname === '/3/tv/21'
            ) {
                data = series;
            } else if (
                url.origin === 'https://api.themoviedb.org' &&
                season &&
                episodes[Number(season[1])]
            ) {
                data = { episodes: episodes[Number(season[1])] };
            } else {
                throw new Error(`Unexpected outbound request: ${url.href}`);
            }
        }
        return Response.json(data);
    });
    return { env, series, episodes, http };
}

describe('continue watching episode selection', () => {
    it('redirects a watched episode to the next aired episode without repeating the resume intent', async () => {
        const { env, episodes, http } = fixture();
        episodes[1].reverse();
        const response = await handle(request(resumePath), env, http);

        expect(response.status).toBe(303);
        expect(response.headers.get('Location')).toBe(
            '/series/21/a-show/watch/1/2',
        );
        expect(http).toHaveBeenCalledTimes(2);
    });

    it.each(['2026-11-11', '2026-11-12', null, ''])(
        'reopens the watched episode when the next air date is %s',
        async (airDate) => {
            const { env, episodes, http } = fixture();
            episodes[1][1].air_date = airDate;

            const response = await handle(request(resumePath), env, http);

            expect(response.status).toBe(303);
            expect(response.headers.get('Location')).toBe(currentPath);
        },
    );

    it('opens the first aired episode of the next season using its actual episode number', async () => {
        const { env, series, episodes, http } = fixture();
        series.seasons.push({
            season_number: 2,
            episode_count: 1,
            air_date: '2026-11-01',
        });
        episodes[2] = [{ episode_number: 3, air_date: '2026-11-01' }];

        const response = await handle(
            request('/series/21/a-show/watch/1/2?resume=next'),
            env,
            http,
        );

        expect(response.status).toBe(303);
        expect(response.headers.get('Location')).toBe(
            '/series/21/a-show/watch/2/3',
        );
    });

    it.each(['2026-11-12', null])(
        'keeps the current episode if the next season has not aired (%s)',
        async (airDate) => {
            const { env, series, http } = fixture();
            series.seasons.push({
                season_number: 2,
                episode_count: 1,
                air_date: airDate as string,
            });

            const response = await handle(
                request('/series/21/a-show/watch/1/2?resume=next'),
                env,
                http,
            );

            expect(response.headers.get('Location')).toBe(
                '/series/21/a-show/watch/1/2',
            );
            expect(http).toHaveBeenCalledTimes(2);
        },
    );

    it('keeps the current episode if the next season has no aired first episode', async () => {
        const { env, series, episodes, http } = fixture();
        series.seasons.push({
            season_number: 2,
            episode_count: 1,
            air_date: '2026-11-01',
        });
        episodes[2] = [{ episode_number: 1, air_date: '2026-11-12' }];

        const response = await handle(
            request('/series/21/a-show/watch/1/2?resume=next'),
            env,
            http,
        );

        expect(response.headers.get('Location')).toBe(
            '/series/21/a-show/watch/1/2',
        );
    });

    it('reopens the last episode if there is no following season', async () => {
        const { env, http } = fixture();

        const response = await handle(
            request('/series/21/a-show/watch/1/2?resume=next'),
            env,
            http,
        );

        expect(response.headers.get('Location')).toBe(
            '/series/21/a-show/watch/1/2',
        );
    });

    it('does not skip episodes missing from an incomplete season response', async () => {
        const { env, series, episodes, http } = fixture();
        episodes[1].pop();
        series.seasons.push({
            season_number: 2,
            episode_count: 1,
            air_date: '2026-11-01',
        });

        const response = await handle(request(resumePath), env, http);

        expect(response.headers.get('Location')).toBe(currentPath);
        expect(http).toHaveBeenCalledTimes(2);
    });

    it('keeps a direct episode link on that episode even when the next episode is available', async () => {
        const { env, http } = fixture();
        await new StateStore(env).set('player-servers', [
            {
                id: 1,
                key: 'test',
                name: 'Player',
                quality: 'HD',
                priority: 1,
                tv_template: 'https://player.example/{tmdb}/{season}/{episode}',
                is_enabled: true,
            },
        ]);

        const response = await handle(request(currentPath), env, http);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.props.selectedEpisode).toBe(1);
        expect(data.props.players[0].url).toBe('https://player.example/21/1/1');
    });

    it('rejects an unaired current episode instead of advancing past it', async () => {
        const { env, episodes, http } = fixture();
        episodes[1][0].air_date = null;

        const response = await handle(request(resumePath), env, http);

        expect(response.status).toBe(404);
        expect(response.headers.has('Location')).toBe(false);
    });

    it('preserves the next-episode intent through Cloudflare verification', async () => {
        const { env, http } = fixture();
        env.WATCH_PROTECTION_ENABLED = 'true';
        env.TURNSTILE_SITE_KEY = 'mock-site-key';
        env.TURNSTILE_SECRET_KEY = 'mock-secret-key';

        const blocked = await handle(request(resumePath), env, http);
        const verificationPath = blocked.headers.get('Location')!;
        expect(verificationPath).toBe(
            `/watch/verify?redirect=${encodeURIComponent(resumePath)}`,
        );
        expect(http).not.toHaveBeenCalled();

        const challenge = await handle(request(verificationPath), env, http);
        expect((await challenge.json()).props.redirect).toBe(resumePath);
        const verified = await handle(
            request('/watch/verify', {
                method: 'POST',
                headers: { Origin: origin, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    redirect: resumePath,
                    'cf-turnstile-response': 'browser-proof',
                }),
            }),
            env,
            http,
        );
        expect(verified.headers.get('Location')).toBe(resumePath);

        const resumed = await handle(
            request(resumePath, {
                headers: {
                    Cookie: verified.headers.get('Set-Cookie')!.split(';')[0],
                },
            }),
            env,
            http,
        );
        expect(resumed.headers.get('Location')).toBe(
            '/series/21/a-show/watch/1/2',
        );
    });

    it.each([
        '/series/21/a-show/watch/1/1?resume=other',
        '/series/21/a-show/watch/1/1?resume=next&redirect=https://other.test',
        '/movie/21/a-movie/watch?resume=next',
        'https://other.test/series/21/a-show/watch/1/1?resume=next',
    ])(
        'rejects unsupported watch verification destinations: %s',
        (destination) => {
            expect(() => watchRedirect(destination)).toThrow('Page not found.');
        },
    );
});
