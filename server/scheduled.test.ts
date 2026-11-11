import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './worker.ts';
import { StateStore } from './state.ts';
import { encrypt } from './security.ts';
import type { Environment } from './types.ts';

function environment(): Environment {
    const values = new Map<string, string>();
    return {
        TMDB_API_TOKEN: 'mock-application-token',
        TMDB_ACCOUNT_ID: '99',
        TMDB_SESSION_ID: 'environment-session',
        TMDB_CACHE_SECONDS: '0',
        SESSION_SECRET: 'local-session-signing-secret-at-least-32-characters',
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
}

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe('scheduled episode scanning', () => {
    it('scans with the saved TMDB connection and persists episodes without an external cron secret', async () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-11-11T12:00:00Z'));
        const env = environment();
        const store = new StateStore(env);
        await store.set(
            'tmdb-credentials',
            await encrypt(env, {
                accountId: 7,
                sessionId: 'approved-session',
                source: 'database',
            }),
        );
        const http = vi.fn<typeof fetch>(async (input, init) => {
            const url = new URL(String(input));
            expect(init?.method).toBe('GET');
            expect(new Headers(init?.headers).get('Authorization')).toBe(
                'Bearer mock-application-token',
            );
            if (
                url.origin === 'https://api.themoviedb.org' &&
                url.pathname === '/3/account/7/watchlist/tv'
            ) {
                expect(url.searchParams.get('session_id')).toBe(
                    'approved-session',
                );
                return Response.json({
                    page: 1,
                    total_pages: 1,
                    total_results: 1,
                    results: [{ id: 21 }],
                });
            }
            if (
                url.origin === 'https://api.themoviedb.org' &&
                url.pathname === '/3/tv/21'
            ) {
                return Response.json({
                    id: 21,
                    name: 'A Show',
                    status: 'Returning Series',
                    in_production: true,
                    genres: [],
                    last_episode_to_air: {
                        season_number: 2,
                        episode_number: 4,
                        name: 'Recent episode',
                        air_date: '2026-11-10',
                    },
                });
            }
            throw new Error('Unexpected scheduled scan request');
        });
        vi.stubGlobal('fetch', http);

        await worker.scheduled({ cron: '0 1 * * *' }, env);

        expect(await store.get('recent-episodes')).toMatchObject([
            {
                id: 21,
                season: 2,
                episode: 4,
                title: 'Recent episode',
                air_date: '2026-11-10',
            },
        ]);
        expect(http).toHaveBeenCalledTimes(2);
    });

    it('refuses to run without persistent storage', async () => {
        const http = vi.fn<typeof fetch>();
        vi.stubGlobal('fetch', http);

        await expect(
            worker.scheduled({}, { ...environment(), STATE: undefined }),
        ).rejects.toMatchObject({ status: 503 });
        expect(http).not.toHaveBeenCalled();
    });

    it('reports authentication errors without replacing previously scanned episodes', async () => {
        const env = environment();
        const store = new StateStore(env);
        await store.set('recent-episodes', [{ id: 21, season: 1, episode: 2 }]);
        const http = vi.fn<typeof fetch>(async (input) => {
            expect(new URL(String(input)).pathname).toBe(
                '/3/account/99/watchlist/tv',
            );
            return Response.json({ success: false }, { status: 401 });
        });
        vi.stubGlobal('fetch', http);

        await expect(worker.scheduled({}, env)).rejects.toMatchObject({
            type: 'authentication',
        });

        expect(await store.get('recent-episodes')).toEqual([
            { id: 21, season: 1, episode: 2 },
        ]);
        expect(http).toHaveBeenCalledOnce();
    });
});
