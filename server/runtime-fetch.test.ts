import { describe, expect, it, vi } from 'vitest';
import { TmdbClient } from './tmdb/client.ts';
import { StateStore } from './state.ts';
import { Players } from './players.ts';
import type { Environment } from './types.ts';

function runtimeFetch(respond: typeof fetch): typeof fetch {
    return function (this: unknown, input, init) {
        if (this !== undefined && this !== globalThis) {
            throw new TypeError(
                'Illegal invocation: function called with incorrect this reference',
            );
        }
        return respond(input, init);
    };
}

describe('HTTP calls in the Cloudflare runtime', () => {
    it('reads TMDB without invoking the transport as a method of the client', async () => {
        const env: Environment = {
            TMDB_API_TOKEN: 'test-token',
            TMDB_CACHE_SECONDS: '0',
        };
        const respond = vi.fn<typeof fetch>(async (input, init) => {
            expect(String(input)).toBe('https://api.themoviedb.org/3/movie/11');
            expect(new Headers(init?.headers).get('Authorization')).toBe(
                'Bearer test-token',
            );
            return Response.json({ id: 11, title: 'A movie' });
        });
        const client = new TmdbClient(
            env,
            new StateStore(env),
            undefined,
            runtimeFetch(respond),
        );

        await expect(client.request('/movie/11')).resolves.toMatchObject({
            id: 11,
        });
        expect(respond).toHaveBeenCalledOnce();
    });

    it('reads the Redis REST store with a receiver-sensitive transport', async () => {
        const respond = vi.fn<typeof fetch>(async (input, init) => {
            expect(String(input)).toBe('https://kv.example.test');
            expect(JSON.parse(String(init?.body))).toEqual([
                'GET',
                'betamovies:missing',
            ]);
            return Response.json({ result: null });
        });
        const store = new StateStore(
            {
                KV_REST_API_URL: 'https://kv.example.test',
                KV_REST_API_TOKEN: 'test-token',
            },
            runtimeFetch(respond),
        );

        await expect(store.get('missing')).resolves.toBeNull();
        expect(respond).toHaveBeenCalledOnce();
    });

    it('resolves a player source with a receiver-sensitive transport', async () => {
        const values = new Map<string, string>();
        const env: Environment = {
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
        const store = new StateStore(env);
        await store.set('player-servers', [
            {
                id: 1,
                key: 'resolver',
                name: 'Resolver',
                is_enabled: true,
                priority: 1,
                movie_template: 'https://resolver.example.test/{tmdb}',
                response_mode: 'body_url',
            },
        ]);
        const respond = vi.fn<typeof fetch>(async (input) => {
            expect(String(input)).toBe('https://resolver.example.test/11');
            return new Response('https://player.example.test/movie/11');
        });
        const players = new Players(store, env, runtimeFetch(respond));

        await expect(players.sources('movie', 11, null)).resolves.toMatchObject(
            [{ id: 'resolver', url: 'https://player.example.test/movie/11' }],
        );
        expect(respond).toHaveBeenCalledOnce();
    });
});
