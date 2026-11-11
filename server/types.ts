export type JsonObject = Record<string, unknown>;
export type MediaType = 'movie' | 'tv';
export type Locale = 'en' | 'ro';
export interface KvBinding {
    get(key: string): Promise<string | null>;
    put(
        key: string,
        value: string,
        options?: { expirationTtl: number },
    ): Promise<void>;
    delete(key: string): Promise<void>;
}
export type Environment = {
    [key: string]: string | KvBinding | undefined;
    STATE?: KvBinding;
};
export const setting = (
    env: Environment,
    key: string,
    fallback = '',
): string => (typeof env[key] === 'string' ? env[key] : fallback);
export const object = (value: unknown): JsonObject =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
        ? (value as JsonObject)
        : {};
export const rows = (value: unknown): JsonObject[] =>
    Array.isArray(value)
        ? value.filter(
              (item): item is JsonObject =>
                  item !== null &&
                  typeof item === 'object' &&
                  !Array.isArray(item),
          )
        : [];
export const text = (value: unknown, fallback = ''): string =>
    typeof value === 'string' ? value : fallback;
export const pick = (value: JsonObject, keys: string[]): JsonObject =>
    Object.fromEntries(
        keys.filter((key) => key in value).map((key) => [key, value[key]]),
    );

export class AppError extends Error {
    constructor(
        public status: number,
        message: string,
        public type = 'request',
        public retryAfter?: number,
    ) {
        super(message);
    }
}
export const positiveId = (value: unknown): number => {
    if (
        !/^\d+$/.test(String(value)) ||
        !Number.isSafeInteger(Number(value)) ||
        Number(value) < 1
    ) {
        throw new AppError(404, 'Page not found.');
    }
    return Number(value);
};
export const pageNumber = (value: unknown): number => {
    if (value === null || value === undefined || value === '') {
        return 1;
    }
    const page = positiveId(value);
    if (page > 500) {
        throw new AppError(422, 'Invalid page number.');
    }
    return page;
};
export const slug = (value: unknown, fallback = 'title'): string =>
    text(value)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || fallback;
