import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handle } from './app.ts';
import { StateStore } from './state.ts';
import { TmdbClient } from './tmdb/client.ts';
import {
    checkOrigin,
    cookie,
    encrypt,
    decrypt,
    hash,
    localRedirect,
    sign,
    verify,
    watchRedirect,
} from './security.ts';
import { isBackendRequest, originalRequest } from './platform.ts';
import { Players } from './players.ts';
import { verifyTurnstile, hasWatchAccess } from './watch.ts';
import { Catalog } from './tmdb/catalog.ts';
import { Account } from './tmdb/account.ts';
import { runScan } from '../cloudflare-scheduler/index.ts';
import { setting, type Environment } from './types.ts';

const origin = 'https://movies.example.test';
const fetchUrl = (input: RequestInfo | URL): string =>
    typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
const movie = {
    id: 11,
    title: 'A Movie',
    release_date: '2026-01-01',
    vote_average: 8.3,
    genre_ids: [28],
    genres: [{ id: 28, name: 'Action' }],
    poster_path: '/poster.jpg',
    credits: { cast: [] },
    videos: { results: [] },
};
const paginated = (results: unknown[], page = 1, pages = 2) => ({
    results,
    page,
    total_pages: pages,
    total_results: 40,
});
const result = (data: unknown, status = 200, headers: HeadersInit = {}) =>
    new Response(JSON.stringify(data), {
        status,
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ...new Headers(headers),
        ]),
    });

let env: Environment;
let http: ReturnType<typeof vi.fn<typeof fetch>>;
beforeEach(() => {
    const values = new Map<string, string>();
    env = {
        TMDB_API_TOKEN: 'application-secret-token',
        TMDB_ACCOUNT_ID: '7',
        TMDB_SESSION_ID: 'private-session',
        SESSION_SECRET: 'session-signing-secret-with-at-least-32-characters',
        ADMIN_PASSWORD: 'admin-password-for-tests',
        TMDB_CACHE_SECONDS: '0',
        WATCH_PROTECTION_ENABLED: 'false',
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
    http = vi.fn<typeof fetch>(async (input) => {
        const url = new URL(fetchUrl(input));
        const path = url.pathname;
        if (/^\/3\/genre\/(movie|tv)\/list$/.test(path)) {
            return result({ genres: [{ id: 28, name: 'Action' }] });
        }
        if (
            /^\/3\/(discover\/movie|movie\/(popular|now_playing)|trending\/tv\/day|search\/multi)$/.test(
                path,
            )
        ) {
            return result(
                paginated(
                    [{ ...movie, media_type: 'movie' }],
                    Number(url.searchParams.get('page')) || 1,
                ),
            );
        }
        if (path === '/3/movie/11') {
            return result(movie);
        }
        if (path === '/3/account/7/watchlist/movies') {
            return result(paginated([movie]));
        }
        if (path === '/3/account/7/watchlist/tv') {
            return result(paginated([], 1, 0));
        }
        throw new Error(`Unexpected outbound request: ${url.origin}${path}`);
    });
});

const request = (path: string, init: RequestInit = {}) =>
    new Request(origin + path, {
        ...init,
        headers: new Headers([
            ['X-Inertia', 'true'],
            ...new Headers(init.headers),
        ]),
    });
async function adminCookie(): Promise<string> {
    return `bm_admin=${await sign(env, { role: 'admin', password: await hash(setting(env, 'ADMIN_PASSWORD')) }, 3600)}`;
}

describe('serverless public routes', () => {
    it('returns the existing homepage and never publishes credentials', async () => {
        const response = await handle(request('/api/page?path=%2F'), env, http);
        expect(response.status).toBe(200);
        expect(response.headers.get('X-Inertia')).toBe('true');
        const data = await response.json();
        expect(data.component).toBe('welcome');
        expect(data.props.popularMovies[0].id).toBe(11);
        expect(data.props.auth.user).toBeNull();
        expect(JSON.stringify(data)).not.toMatch(
            /application-secret-token|private-session|session-signing-secret|admin-password-for-tests/,
        );
        expect(
            http.mock.calls.every(([, init]) => init?.method === 'GET'),
        ).toBe(true);
    });
    it('preserves catalog filters, pagination and Inertia infinite scroll metadata', async () => {
        const response = await handle(
            request('/movies?genre=28&page=2'),
            env,
            http,
        );
        const data = await response.json();
        expect(data.props.catalog.page).toBe(2);
        expect(data.props.catalog.items[0].score).toBe('8.3');
        expect(data.props.filters.genre).toBe('28');
        expect(data.mergeProps).toEqual(['catalog.items']);
        expect(data.scrollProps.catalog).toMatchObject({
            previousPage: 1,
            currentPage: 2,
            nextPage: null,
        });
        expect(
            http.mock.calls.some(([url]) =>
                fetchUrl(url).includes('with_genres=28'),
            ),
        ).toBe(true);
    });
    it('supports partial reloads without replacing unrelated page props', async () => {
        const response = await handle(
            request('/movies?page=2', {
                headers: {
                    'X-Inertia-Partial-Component': 'movies/index',
                    'X-Inertia-Partial-Data': 'catalog',
                },
            }),
            env,
            http,
        );
        expect((await response.json()).props).toHaveProperty('catalog');
        expect(
            (
                await handle(
                    request('/movies?page=2', {
                        headers: {
                            'X-Inertia-Partial-Component': 'movies/index',
                            'X-Inertia-Partial-Data': 'catalog',
                        },
                    }),
                    env,
                    http,
                )
            ).status,
        ).toBe(200);
    });
    it('searches live data and formats ratings in the existing response shape', async () => {
        const response = await handle(
            request('/catalog/search?q=movie'),
            env,
            http,
        );
        expect((await response.json()).items[0]).toMatchObject({
            id: 11,
            score: '8.3',
            type: 'film',
        });
    });
    it('preserves Romanian preferences and keeps private responses uncached', async () => {
        const response = await handle(
            request('/movies', { headers: { Cookie: 'locale=ro' } }),
            env,
            http,
        );
        expect(response.headers.get('Content-Language')).toBe('ro');
        expect((await response.json()).props.locale).toBe('ro');
        expect(
            http.mock.calls.some(([url]) =>
                fetchUrl(url).includes('language=ro-RO'),
            ),
        ).toBe(true);
        expect(response.headers.get('Cache-Control')).toContain('no-store');
    });
    it('uses the configured contact email without depending on TMDB', async () => {
        const response = await handle(
            request('/contact'),
            { ...env, MAIL_FROM_ADDRESS: 'contact@example.test' },
            http,
        );
        expect((await response.json()).props.contactEmail).toBe(
            'contact@example.test',
        );
        expect(http).not.toHaveBeenCalled();
    });
    it('returns a styled 404 and does not turn invalid catalog parameters into results', async () => {
        const missing = await handle(request('/missing'), env, http);
        expect(missing.status).toBe(404);
        expect((await missing.json()).component).toBe('error');
        expect(
            (await handle(request('/movies?page=-1'), env, http)).status,
        ).toBe(404);
        expect(
            (await handle(request('/movies?list=invalid'), env, http)).status,
        ).toBe(422);
        expect(http).not.toHaveBeenCalled();
    });
    it('keeps TMDB failures visible instead of returning an empty successful catalog', async () => {
        http.mockImplementation(async () => result({ status_code: 7 }, 401));
        const response = await handle(request('/movies'), env, http);
        expect(response.status).toBe(503);
        expect((await response.json()).component).toBe('error');
    });
    it('retains the shared TMDB watchlist and automatic paging', async () => {
        const response = await handle(request('/watchlist'), env, http);
        const data = await response.json();
        expect(data.component).toBe('watchlist');
        expect(data.props.catalog.items[0].id).toBe(11);
        expect(data.scrollProps.catalog.nextPage).toBe(2);
    });
});

describe('serverless authentication and mutations', () => {
    it.each(['memory', 'kv'] as const)(
        'clears the displayed logs using %s storage',
        async (storage) => {
            const runtime =
                storage === 'memory' ? { ...env, STATE: undefined } : env;
            const store = new StateStore(runtime, http);
            await store.set('events', [
                {
                    at: 1700000000000,
                    path: '/logged-error',
                    status: 404,
                    type: 'request',
                },
            ]);
            const headers = { Origin: origin, Cookie: await adminCookie() };
            const before = await handle(
                request('/admin/logs', { headers }),
                runtime,
                http,
            );
            expect((await before.json()).props.content).toContain(
                '/logged-error',
            );

            const cleared = await handle(
                request('/admin/logs/serverless.log/clear', {
                    method: 'PATCH',
                    headers,
                }),
                runtime,
                http,
            );

            expect(cleared.status).toBe(303);
            expect(cleared.headers.get('Location')).toBe('/admin/logs');
            const after = await handle(
                request('/admin/logs', { headers }),
                runtime,
                http,
            );
            const data = await after.json();
            expect(data.props.content).toBe('');
            expect(data.props.files[0].size).toBe(0);
            expect(http).not.toHaveBeenCalled();
        },
    );

    it('requires admin authentication for account mutations and rejects cross-origin requests', async () => {
        const response = await handle(
            request('/watchlist/movie/11', {
                method: 'POST',
                headers: { Origin: origin },
            }),
            env,
            http,
        );
        expect(response.status).toBe(401);
        expect(http).not.toHaveBeenCalled();
        expect(
            (
                await handle(
                    request('/admin/player-servers', {
                        method: 'POST',
                        headers: {
                            Origin: 'https://attacker.example',
                            Referer: origin,
                            Cookie: await adminCookie(),
                        },
                        body: '{}',
                    }),
                    env,
                    http,
                )
            ).status,
        ).toBe(403);
    });
    it('signs an HttpOnly admin session and restricts the old insecure login route', async () => {
        const response = await handle(
            request('/admin/login', {
                method: 'POST',
                headers: { Origin: origin, 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: env.ADMIN_PASSWORD }),
            }),
            env,
            http,
        );
        expect(response.status).toBe(303);
        expect(response.headers.get('Set-Cookie')).toMatch(
            /HttpOnly; SameSite=Lax; Max-Age=86400; Secure/,
        );
        const session = response.headers.get('Set-Cookie')!.split(';')[0];
        expect(
            (
                await handle(
                    request('/admin/player-servers', {
                        headers: { Cookie: session },
                    }),
                    env,
                    http,
                )
            ).status,
        ).toBe(200);
        expect(
            (await handle(request('/login-with-id/1'), env, http)).status,
        ).toBe(404);
    });
    it('validates login credentials and limits repeated attempts', async () => {
        for (let index = 0; index < 5; index++) {
            const response = await handle(
                request('/admin/login', {
                    method: 'POST',
                    headers: { Origin: origin },
                    body: 'password=wrong',
                }),
                env,
                http,
            );
            expect((await response.json()).props.errors.password).toBe(
                'Incorrect password.',
            );
        }
        expect(
            (
                await handle(
                    request('/admin/login', {
                        method: 'POST',
                        headers: { Origin: origin },
                        body: 'password=wrong',
                    }),
                    env,
                    http,
                )
            ).status,
        ).toBe(429);
    });
    it('persists server additions and toggles using the same fields as the existing UI', async () => {
        const headers = {
            Origin: origin,
            Cookie: await adminCookie(),
            'Content-Type': 'application/json',
        };
        const create = await handle(
            request('/admin/player-servers', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: 'Custom Player',
                    quality: '1080p',
                    priority: 99,
                    movie_template: 'https://player.example/embed/{tmdb}',
                    is_enabled: '1',
                }),
            }),
            env,
            http,
        );
        expect(create.status).toBe(303);
        const data = await (
            await handle(
                request('/admin/player-servers', { headers }),
                env,
                http,
            )
        ).json();
        const server = data.props.servers.find(
            (entry: { key: string }) => entry.key === 'custom-player',
        );
        expect(server).toMatchObject({ is_enabled: true, priority: 99 });
        expect(
            (
                await handle(
                    request(`/admin/player-servers/${server.id}`, {
                        method: 'PATCH',
                        headers,
                        body: JSON.stringify({ is_enabled: '0' }),
                    }),
                    env,
                    http,
                )
            ).status,
        ).toBe(303);
        const providers = new Players(new StateStore(env, http), env, http);
        expect(
            (await providers.sources('movie', 11, null)).some(
                (source) => source.id === 'custom-player',
            ),
        ).toBe(false);
    });
    it('persists watch protection switches and blocks unsupported writes without durable storage', async () => {
        const headers = { Origin: origin, Cookie: await adminCookie() };
        expect(
            (
                await handle(
                    request('/admin/watch-protection', {
                        method: 'PATCH',
                        headers,
                        body: 'is_enabled=1',
                    }),
                    env,
                    http,
                )
            ).status,
        ).toBe(303);
        const response = await handle(
            request('/movie/11/a-movie/watch'),
            env,
            http,
        );
        expect(response.headers.get('Location')).toContain(
            '/watch/verify?redirect=',
        );
        expect(
            (
                await handle(
                    request('/admin/watch-protection', {
                        method: 'PATCH',
                        headers,
                        body: 'is_enabled=1',
                    }),
                    { ...env, STATE: undefined },
                    http,
                )
            ).status,
        ).toBe(503);
    });
});

describe('TMDB client boundaries', () => {
    it('uses v3 bearer authentication and caches reads with all relevant parameters', async () => {
        const cachedEnv = { ...env, TMDB_CACHE_SECONDS: '300' };
        const client = new TmdbClient(
            cachedEnv,
            new StateStore(cachedEnv, http),
            undefined,
            http,
        );
        await client.request('/movie/11', { language: 'en-US' });
        await client.request('/movie/11', { language: 'en-US' });
        await client.request('/movie/11', { language: 'ro-RO' });
        expect(http).toHaveBeenCalledTimes(2);
        expect(fetchUrl(http.mock.calls[0][0])).toContain('/3/movie/11');
        expect(http.mock.calls[0][1]?.headers).toMatchObject({
            Authorization: 'Bearer application-secret-token',
        });
    });
    it('never caches private reads or mixes two user sessions', async () => {
        const client = new TmdbClient(
            { ...env, TMDB_CACHE_SECONDS: '300' },
            new StateStore(env, http),
            undefined,
            http,
        );
        await client.request('/account/7/watchlist/movies', {
            session_id: 'one',
        });
        await client.request('/account/7/watchlist/movies', {
            session_id: 'two',
        });
        await client.request('/account/7/watchlist/movies', {
            session_id: 'one',
        });
        expect(http).toHaveBeenCalledTimes(3);
    });
    it('respects Retry-After and retries reads without repeating mutations', async () => {
        http.mockResolvedValueOnce(
            result({}, 429, { 'Retry-After': '0' }),
        ).mockResolvedValueOnce(result(movie));
        const client = new TmdbClient(
            env,
            new StateStore(env, http),
            undefined,
            http,
        );
        expect((await client.request('/movie/11')).id).toBe(11);
        expect(http).toHaveBeenCalledTimes(2);
        http.mockClear().mockResolvedValueOnce(result({}, 503));
        await expect(
            client.request(
                '/account/7/watchlist',
                {},
                { method: 'POST', body: { watchlist: true } },
            ),
        ).rejects.toMatchObject({ status: 503 });
        expect(http).toHaveBeenCalledTimes(1);
    });
    it('reports invalid JSON and propagates cancellation', async () => {
        http.mockResolvedValueOnce(new Response('not-json'));
        const client = new TmdbClient(
            env,
            new StateStore(env, http),
            undefined,
            http,
        );
        await expect(client.request('/movie/11')).rejects.toMatchObject({
            type: 'invalid_response',
        });
        const controller = new AbortController();
        controller.abort();
        await expect(
            new TmdbClient(
                env,
                new StateStore(env, http),
                controller.signal,
                http,
            ).request('/movie/11'),
        ).rejects.toBeDefined();
    });
});

describe('session and hosting boundaries', () => {
    it('uses an existing Laravel APP_KEY when SESSION_SECRET is unset', async () => {
        const compatible = {
            ...env,
            SESSION_SECRET: '',
            APP_KEY: 'existing-application-key-with-at-least-32-characters',
        };
        const token = await sign(compatible, { watch: true }, 300);
        expect((await verify(compatible, token))?.watch).toBe(true);
        expect(
            await verify(
                {
                    ...compatible,
                    APP_KEY:
                        'different-application-key-with-at-least-32-characters',
                },
                token,
            ),
        ).toBeNull();
    });
    it('rejects tampered sessions and stores credentials encrypted', async () => {
        const token = await sign(env, { role: 'admin' }, 300);
        expect((await verify(env, token))?.role).toBe('admin');
        expect(await verify(env, `${token}invalid`)).toBeNull();
        const encrypted = await encrypt(env, { sessionId: 'private-session' });
        expect(encrypted).not.toContain('private-session');
        expect(await decrypt(env, encrypted)).toEqual({
            sessionId: 'private-session',
        });
        expect(
            cookie(
                new Request(origin, { headers: { Cookie: 'locale=%invalid' } }),
                'locale',
            ),
        ).toBe('');
    });
    it('rejects external redirects and keeps static assets outside the API', () => {
        expect(localRedirect('//attacker.example')).toBe('/');
        expect(() => watchRedirect('/admin/watchlist')).toThrow();
        expect(() =>
            checkOrigin(
                new Request(origin, {
                    headers: {
                        Origin: 'https://attacker.example',
                        Referer: origin,
                    },
                }),
            ),
        ).toThrow();
        expect(isBackendRequest(new Request(origin + '/assets/app.js'))).toBe(
            false,
        );
        expect(isBackendRequest(request('/movies'))).toBe(true);
        expect(
            originalRequest(
                new Request(origin + '/api/index?__path=/movies&page=2'),
            ).url,
        ).toBe(origin + '/movies?page=2');
    });
});

describe('watch verification and episode availability', () => {
    it('permits official Turnstile test keys only for a local development request', async () => {
        const localEnv = {
            ...env,
            TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
        };
        const input = {
            redirect: '/movie/11/a-movie/watch',
            'cf-turnstile-response': 'XXXX.DUMMY.TOKEN.XXXX',
        };
        const validation = vi
            .fn<typeof fetch>()
            .mockResolvedValue(result({ success: true }));
        expect(
            await verifyTurnstile(
                new Request('http://localhost/watch/verify'),
                localEnv,
                input,
                validation,
            ),
        ).toContain('bm_watch=');
        await expect(
            verifyTurnstile(
                request('/watch/verify'),
                localEnv,
                input,
                validation,
            ),
        ).rejects.toMatchObject({ status: 503 });
    });

    it('only unlocks watch after server-side verification of the action and hostname', async () => {
        const localEnv = {
            ...env,
            TURNSTILE_SITE_KEY: 'public-site-key',
            TURNSTILE_SECRET_KEY: 'private-turnstile-key',
            WATCH_PROTECTION_ENABLED: 'true',
        };
        const input = {
            redirect: '/movie/11/a-movie/watch',
            'cf-turnstile-response': 'browser-proof',
        };
        const validation = vi.fn<typeof fetch>().mockResolvedValue(
            result({
                success: true,
                action: 'watch_movie_11',
                hostname: 'movies.example.test',
                challenge_ts: new Date().toISOString(),
            }),
        );
        const signed = await verifyTurnstile(
            request('/watch/verify'),
            localEnv,
            input,
            validation,
        );
        expect(signed).toContain('HttpOnly');
        expect(
            await hasWatchAccess(
                request('/', { headers: { Cookie: signed.split(';')[0] } }),
                localEnv,
            ),
        ).toBe(true);
        expect(
            await hasWatchAccess(
                request('/', {
                    headers: { Cookie: signed.split(';')[0] + 'invalid' },
                }),
                localEnv,
            ),
        ).toBe(false);
        validation.mockResolvedValueOnce(
            result({
                success: true,
                action: 'watch_movie_11',
                hostname: 'attacker.example',
                challenge_ts: new Date().toISOString(),
            }),
        );
        await expect(
            verifyTurnstile(
                request('/watch/verify'),
                localEnv,
                input,
                validation,
            ),
        ).rejects.toMatchObject({ status: 422 });
        expect(JSON.stringify(validation.mock.calls[0][1]?.body)).toContain(
            'private-turnstile-key',
        );
    });

    it('excludes unaired episodes and refuses selecting them by URL', async () => {
        http.mockImplementation(async (input) => {
            const path = new URL(fetchUrl(input)).pathname;
            if (path === '/3/tv/21') {
                return result({
                    id: 21,
                    name: 'A Show',
                    seasons: [
                        {
                            id: 30,
                            name: 'Season 1',
                            season_number: 1,
                            episode_count: 2,
                            air_date: '2020-01-01',
                        },
                    ],
                    external_ids: {},
                    genres: [],
                });
            }
            if (path === '/3/tv/21/season/1') {
                return result({
                    episodes: [
                        {
                            id: 1,
                            name: 'Aired episode',
                            episode_number: 1,
                            air_date: '2020-01-01',
                        },
                        {
                            id: 2,
                            name: 'Unaired episode',
                            episode_number: 2,
                            air_date: '2999-01-01',
                        },
                    ],
                });
            }
            throw new Error(`Unexpected request: ${path}`);
        });
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
        const response = await handle(
            request('/series/21/a-show/watch/1/1'),
            env,
            http,
        );
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.props.episodes).toHaveLength(1);
        expect(data.props.players[0].url).toBe('https://player.example/21/1/1');
        expect(
            (await handle(request('/series/21/a-show/watch/1/2'), env, http))
                .status,
        ).toBe(404);
    });

    it('resets infinite scroll when filters change', async () => {
        const response = await handle(
            request('/movies?genre=28', {
                headers: { 'X-Inertia-Reset': 'catalog' },
            }),
            env,
            http,
        );
        const data = await response.json();
        expect(data.mergeProps).toEqual([]);
        expect(data.scrollProps.catalog.reset).toBe(true);
    });
});

describe('daily episode scanning', () => {
    it('reads all watchlist pages before removing ended shows and saves the recent episodes', async () => {
        const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);
        const calls: string[] = [];
        http.mockImplementation(async (input, options) => {
            const url = new URL(fetchUrl(input));
            const method = options?.method ?? 'GET';
            calls.push(
                method +
                    ' ' +
                    url.pathname +
                    '?page=' +
                    url.searchParams.get('page'),
            );
            if (url.pathname === '/3/account/7/watchlist/tv') {
                return result(
                    paginated(
                        url.searchParams.get('page') === '2'
                            ? [{ id: 23 }]
                            : [{ id: 21 }, { id: 22 }],
                        Number(url.searchParams.get('page')),
                        2,
                    ),
                );
            }
            if (url.pathname.startsWith('/3/tv/')) {
                const id = Number(url.pathname.split('/').at(-1));
                return result({
                    id,
                    name: `Show ${id}`,
                    status: id === 21 ? 'Ended' : 'Returning Series',
                    genres: [],
                    last_episode_to_air: {
                        season_number: 1,
                        episode_number: 2,
                        name: 'Recent episode',
                        air_date: yesterday,
                    },
                });
            }
            if (
                url.pathname === '/3/account/7/watchlist' &&
                method === 'POST'
            ) {
                expect(
                    JSON.parse(
                        typeof options?.body === 'string' ? options.body : '{}',
                    ),
                ).toMatchObject({
                    media_id: 21,
                    watchlist: false,
                });
                return result({ success: true });
            }
            throw new Error('Unexpected scan request.');
        });
        const store = new StateStore(env, http);
        const account = new Account(
            new Catalog(
                new TmdbClient(env, store, undefined, http),
                'en',
                'US',
            ),
            store,
            env,
        );
        expect(
            (await account.scanEpisodes()).map((episode) => episode.id),
        ).toEqual([22, 23]);
        expect(calls.at(-1)).toContain('POST /3/account/7/watchlist');
        expect(await store.get('recent-episodes')).toHaveLength(2);
    });

    it('calls the same protected scan endpoint from the Cloudflare scheduler', async () => {
        const scheduled = vi
            .fn<typeof fetch>()
            .mockResolvedValue(result({ episodes: [] }));
        await runScan(
            { APP_URL: origin, CRON_SECRET: 'scheduler-secret' },
            scheduled,
        );
        expect(fetchUrl(scheduled.mock.calls[0][0])).toBe(
            origin + '/api/scan-episodes',
        );
        expect(scheduled.mock.calls[0][1]?.headers).toMatchObject({
            Authorization: 'Bearer scheduler-secret',
        });
        await expect(
            runScan({ APP_URL: origin, CRON_SECRET: '' }, scheduled),
        ).rejects.toThrow();
    });
});
