import {
    AppError,
    object,
    setting,
    type Environment,
    type JsonObject,
} from '../types.ts';
import { StateStore } from '../state.ts';
import { hash } from '../security.ts';

export type Query = Record<
    string,
    string | number | boolean | null | undefined
>;
export class TmdbClient {
    constructor(
        private env: Environment,
        private store: StateStore,
        private signal?: AbortSignal,
        private http: typeof fetch = fetch,
    ) {}

    async request(
        path: string,
        query: Query = {},
        options: {
            method?: string;
            body?: unknown;
            private?: boolean;
            version?: 3 | 4;
            token?: string;
        } = {},
    ): Promise<JsonObject> {
        if (!/^\/[a-zA-Z0-9_/-]+$/.test(path)) {
            throw new AppError(400, 'Invalid TMDB resource path.');
        }
        const token = options.token ?? setting(this.env, 'TMDB_API_TOKEN');
        if (!token) {
            throw new AppError(
                503,
                'TMDB_API_TOKEN is not configured.',
                'configuration',
            );
        }
        const url = new URL(
            `https://api.themoviedb.org/${options.version ?? 3}${path}`,
        );
        Object.entries(query).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.set(key, String(value));
            }
        });
        url.searchParams.sort();
        const method = options.method ?? 'GET';
        const privateRequest =
            options.private ||
            method !== 'GET' ||
            /^\/(?:account|authentication|auth|list)\b/.test(path) ||
            path.endsWith('/account_states');
        const cacheKey = `tmdb:${await hash(url.toString())}`;
        const ttl = Math.max(
            0,
            Number(setting(this.env, 'TMDB_CACHE_SECONDS', '1800')) || 0,
        );
        if (!privateRequest && ttl > 0) {
            const cached = await this.store.get<JsonObject>(cacheKey);
            if (cached) {
                return cached;
            }
        }
        let result: JsonObject | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
            this.signal?.throwIfAborted();
            const signal = AbortSignal.timeout(
                Math.min(
                    30000,
                    Math.max(
                        100,
                        (Number(setting(this.env, 'TMDB_TIMEOUT', '10')) ||
                            10) * 1000,
                    ),
                ),
            );
            let response: Response;
            try {
                response = await this.http(url, {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        ...(options.body === undefined
                            ? {}
                            : { 'Content-Type': 'application/json' }),
                    },
                    body:
                        options.body === undefined
                            ? undefined
                            : JSON.stringify(options.body),
                    signal: this.signal
                        ? AbortSignal.any([this.signal, signal])
                        : signal,
                });
            } catch {
                this.signal?.throwIfAborted();
                if (method === 'GET' && attempt < 2) {
                    await this.backoff(200 * 2 ** attempt);
                    continue;
                }
                throw new AppError(
                    503,
                    'TMDB could not be reached. Please try again.',
                    'network',
                );
            }
            const retry = response.headers.get('retry-after');
            const retryAfter = retry
                ? /^\d+$/.test(retry)
                    ? Number(retry)
                    : Math.max(
                          0,
                          Math.ceil((Date.parse(retry) - Date.now()) / 1000),
                      )
                : undefined;
            if (!response.ok) {
                if (
                    method === 'GET' &&
                    attempt < 2 &&
                    [429, 500, 502, 503, 504].includes(response.status) &&
                    (retryAfter ?? 0) <= 5
                ) {
                    await response.body?.cancel();
                    await this.backoff(
                        retryAfter === undefined
                            ? 200 * 2 ** attempt
                            : retryAfter * 1000,
                    );
                    continue;
                }
                const type =
                    (
                        {
                            401: 'authentication',
                            403: 'permission',
                            404: 'not_found',
                            429: 'rate_limit',
                        } as Record<number, string>
                    )[response.status] ?? 'upstream';
                await response.body?.cancel();
                throw new AppError(
                    response.status === 404
                        ? 404
                        : response.status === 429
                          ? 429
                          : 503,
                    response.status === 404
                        ? 'Title not found.'
                        : 'TMDB is currently unavailable.',
                    type,
                    retryAfter,
                );
            }
            try {
                const data: unknown = await response.json();
                if (
                    !data ||
                    typeof data !== 'object' ||
                    Array.isArray(data) ||
                    object(data).success === false
                ) {
                    throw new Error('Invalid response');
                }
                result = object(data);
            } catch {
                throw new AppError(
                    502,
                    'TMDB returned an invalid response.',
                    'invalid_response',
                );
            }
            break;
        }
        if (!result) {
            throw new AppError(503, 'TMDB is currently unavailable.');
        }
        if (!privateRequest && ttl > 0) {
            await this.store.set(cacheKey, result, ttl);
        }
        return result;
    }

    private async backoff(milliseconds: number): Promise<void> {
        if (milliseconds <= 0) {
            return;
        }
        await new Promise<void>((resolve, reject) => {
            const abort = () => {
                clearTimeout(timer);
                reject(this.signal?.reason);
            };
            const timer = setTimeout(() => {
                this.signal?.removeEventListener('abort', abort);
                resolve();
            }, milliseconds);
            this.signal?.addEventListener('abort', abort, { once: true });
        });
    }
}
