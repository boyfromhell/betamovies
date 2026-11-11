import defaults from './player-defaults.json' with { type: 'json' };
import {
    AppError,
    rows,
    setting,
    slug,
    text,
    type Environment,
    type JsonObject,
    type MediaType,
} from './types.ts';
import { StateStore } from './state.ts';

export class Players {
    constructor(
        private store: StateStore,
        private env: Environment,
        private http: typeof fetch = fetch,
    ) {}
    async all(): Promise<JsonObject[]> {
        return (
            (await this.store.get<JsonObject[]>('player-servers')) ?? defaults
        );
    }

    async save(input: JsonObject, id?: number): Promise<void> {
        this.store.requireDurable();
        const servers = await this.all();
        const existing = servers.find((server) => server.id === id);
        if (id && !existing) {
            throw new AppError(404, 'Server not found.');
        }
        if (id && 'is_enabled' in input) {
            if (
                !['0', '1', true, false, 0, 1].includes(
                    input.is_enabled as string,
                )
            ) {
                throw new AppError(422, 'Invalid server status.');
            }
            existing!.is_enabled = [true, 1, '1'].includes(
                input.is_enabled as boolean,
            );
        } else {
            const name = text(input.name).trim();
            const baseKey = slug(name, 'server').slice(0, 40);
            let key = baseKey;
            for (
                let suffix = 2;
                servers.some((server) => server.key === key);
                suffix++
            ) {
                key = `${baseKey}-${suffix}`;
            }
            const movie = text(input.movie_template).trim(),
                tv = text(input.tv_template).trim();
            if (
                !/^[a-z0-9][a-z0-9_-]{0,49}$/.test(key) ||
                servers.some((server) => server.key === key) ||
                !name ||
                name.length > 100 ||
                (!movie && !tv)
            ) {
                throw new AppError(
                    422,
                    'Enter a unique server key, name and at least one HTTPS template.',
                );
            }
            for (const template of [movie, tv].filter(Boolean)) {
                if (
                    !this.validUrl(
                        template.replace(
                            /\{(?:tmdb|imdb|season|episode|zero\|season|zero\|episode)\}/g,
                            '1',
                        ),
                    ) ||
                    /\{(?!tmdb\}|imdb\}|season\}|episode\}|zero\|season\}|zero\|episode\})/.test(
                        template,
                    )
                ) {
                    throw new AppError(422, 'Invalid HTTPS player template.');
                }
            }
            const priority = Number(input.priority ?? 0);
            if (
                !Number.isInteger(priority) ||
                priority < 0 ||
                priority > 10000
            ) {
                throw new AppError(
                    422,
                    'Priority must be between 0 and 10000.',
                );
            }
            const mode = text(input.response_mode, 'direct');
            if (!['direct', 'body_url'].includes(mode)) {
                throw new AppError(422, 'Invalid response mode.');
            }
            servers.push({
                id:
                    Math.max(0, ...servers.map((server) => Number(server.id))) +
                    1,
                key,
                name,
                quality: text(input.quality, 'HD').slice(0, 40),
                priority,
                movie_template: movie || null,
                tv_template: tv || null,
                response_mode: mode,
                is_enabled:
                    input.is_enabled === undefined ||
                    [true, 1, '1'].includes(input.is_enabled as boolean),
            });
        }
        await this.store.set('player-servers', servers);
    }

    async sources(
        type: MediaType,
        tmdb: number,
        imdb: string | null,
        season?: number,
        episode?: number,
    ): Promise<JsonObject[]> {
        const servers = (await this.all())
            .filter((server) => server.is_enabled)
            .sort(
                (left, right) => Number(right.priority) - Number(left.priority),
            );
        const replacements: Record<string, string | number | null | undefined> =
            { tmdb, imdb, season, episode };
        const http = this.http;
        const sources = await Promise.all(
            servers.map(async (server) => {
                const template = text(
                    server[type === 'movie' ? 'movie_template' : 'tv_template'],
                );
                if (!template) {
                    return null;
                }
                let complete = true;
                let url = template.replace(/\{([^}]+)\}/g, (_, raw: string) => {
                    const padded = raw.startsWith('zero|');
                    const value = replacements[padded ? raw.slice(5) : raw];
                    if (value === null || value === undefined || value === '') {
                        complete = false;
                        return '';
                    }
                    return encodeURIComponent(
                        padded ? String(value).padStart(2, '0') : String(value),
                    );
                });
                if (!complete || !this.validUrl(url)) {
                    return null;
                }
                if (server.response_mode === 'body_url') {
                    try {
                        const response = await http(url, {
                            redirect: 'manual',
                            signal: AbortSignal.timeout(5000),
                            headers: { Accept: 'text/plain' },
                        });
                        if (!response.ok) {
                            await response.body?.cancel();
                            return null;
                        }
                        url = (await response.text()).trim();
                        if (url.length > 8192 || !this.validUrl(url)) {
                            return null;
                        }
                    } catch {
                        return null;
                    }
                }
                return {
                    id: server.key,
                    name: server.name,
                    quality: server.quality,
                    url,
                    default:
                        server.key ===
                        setting(this.env, 'VIDEO_PLAYER_DEFAULT', 'super'),
                };
            }),
        );
        return rows(sources);
    }

    private validUrl(value: string): boolean {
        try {
            const url = new URL(value);
            return (
                url.protocol === 'https:' &&
                !url.username &&
                !url.password &&
                !url.hostname.includes(':') &&
                !/^\d+(?:\.\d+){3}$/.test(url.hostname) &&
                !/^(?:localhost|0x[0-9a-f]+)$/i.test(url.hostname) &&
                !url.hostname.endsWith('.local') &&
                url.hostname.includes('.')
            );
        } catch {
            return false;
        }
    }
}
