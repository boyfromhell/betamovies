import { AppError, setting, type Environment } from './types.ts';

const memory = new Map<string, { value: unknown; expires: number }>();

export class StateStore {
    readonly durable: boolean;
    constructor(
        private env: Environment,
        private http: typeof fetch = fetch,
    ) {
        this.durable = Boolean(
            env.STATE ||
            (setting(env, 'KV_REST_API_URL') &&
                setting(env, 'KV_REST_API_TOKEN')),
        );
    }

    requireDurable(): void {
        if (!this.durable) {
            throw new AppError(
                503,
                'Configure STATE (Cloudflare KV) or KV_REST_API_URL and KV_REST_API_TOKEN to save settings.',
            );
        }
    }

    private async command(args: (string | number)[]): Promise<unknown> {
        const url = setting(this.env, 'KV_REST_API_URL');
        if (!url.startsWith('https://')) {
            throw new AppError(503, 'The state storage URL must use HTTPS.');
        }
        const response = await this.http(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${setting(this.env, 'KV_REST_API_TOKEN')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(args),
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) {
            throw new AppError(503, 'State storage is unavailable.');
        }
        const data = (await response.json()) as {
            result?: unknown;
            error?: string;
        };
        if (data.error) {
            throw new AppError(503, 'State storage rejected the request.');
        }
        return data.result;
    }

    async get<T>(key: string): Promise<T | null> {
        const name = `betamovies:${key}`;
        if (this.env.STATE) {
            const value = await this.env.STATE.get(name);
            return value === null ? null : (JSON.parse(value) as T);
        }
        if (this.durable) {
            const value = await this.command(['GET', name]);
            return typeof value === 'string' ? (JSON.parse(value) as T) : null;
        }
        const cached = memory.get(name);
        if (!cached || cached.expires < Date.now()) {
            memory.delete(name);
            return null;
        }
        return cached.value as T;
    }

    async set(key: string, value: unknown, ttl?: number): Promise<void> {
        const name = `betamovies:${key}`;
        const serialized = JSON.stringify(value);
        if (this.env.STATE) {
            await this.env.STATE.put(
                name,
                serialized,
                ttl ? { expirationTtl: Math.max(60, ttl) } : undefined,
            );
        } else if (this.durable) {
            await this.command([
                'SET',
                name,
                serialized,
                ...(ttl ? ['EX', ttl] : []),
            ]);
        } else {
            if (memory.size >= 512) {
                const first = memory.keys().next().value;
                if (first) {
                    memory.delete(first);
                }
            }
            memory.set(name, {
                value,
                expires: Date.now() + (ttl ?? 3600) * 1000,
            });
        }
    }

    async delete(key: string): Promise<void> {
        const name = `betamovies:${key}`;
        if (this.env.STATE) {
            await this.env.STATE.delete(name);
        } else if (this.durable) {
            await this.command(['DEL', name]);
        } else {
            memory.delete(name);
        }
    }

    async limit(key: string, maximum: number, seconds: number): Promise<void> {
        const name = `limit:${key}:${Math.floor(Date.now() / (seconds * 1000))}`;
        let count: number;
        if (this.durable && !this.env.STATE) {
            count = Number(await this.command(['INCR', `betamovies:${name}`]));
            if (count === 1) {
                await this.command(['EXPIRE', `betamovies:${name}`, seconds]);
            }
        } else {
            count = ((await this.get<number>(name)) ?? 0) + 1;
            await this.set(name, count, seconds);
        }
        if (count > maximum) {
            throw new AppError(
                429,
                'Too many requests. Please try again later.',
                'rate_limit',
                seconds,
            );
        }
    }
}
