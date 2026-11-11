import {
    AppError,
    object,
    setting,
    text,
    type Environment,
    type JsonObject,
} from './types.ts';

const encoder = new TextEncoder();
const base64 = (bytes: Uint8Array): string =>
    btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
const unbase64 = (value: string): Uint8Array<ArrayBuffer> =>
    Uint8Array.from(
        atob(value.replace(/-/g, '+').replace(/_/g, '/')),
        (character) => character.charCodeAt(0),
    );

export function cookie(request: Request, name: string): string {
    const value =
        request.headers
            .get('cookie')
            ?.split(';')
            .map((item) => item.trim())
            .find((item) => item.startsWith(`${name}=`))
            ?.slice(name.length + 1) ?? '';
    try {
        return decodeURIComponent(value);
    } catch {
        return '';
    }
}

export function setCookie(
    request: Request,
    name: string,
    value: string,
    seconds: number,
): string {
    return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}

function secret(env: Environment): string {
    const value = setting(env, 'SESSION_SECRET') || setting(env, 'APP_KEY');
    if (value.length < 32) {
        throw new AppError(
            503,
            'Set SESSION_SECRET or APP_KEY with at least 32 characters.',
        );
    }
    return value;
}

export async function hash(value: string): Promise<string> {
    return base64(
        new Uint8Array(
            await crypto.subtle.digest('SHA-256', encoder.encode(value)),
        ),
    );
}

export async function sign(
    env: Environment,
    value: JsonObject,
    seconds: number,
): Promise<string> {
    const data = base64(
        encoder.encode(
            JSON.stringify({
                ...value,
                exp: Math.floor(Date.now() / 1000) + seconds,
            }),
        ),
    );
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret(env)),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    return `${data}.${base64(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data))))}`;
}

export async function verify(
    env: Environment,
    token: string,
): Promise<JsonObject | null> {
    if (!token) {
        return null;
    }
    try {
        const [data, signature, extra] = token.split('.');
        if (!data || !signature || extra) {
            return null;
        }
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret(env)),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify'],
        );
        if (
            !(await crypto.subtle.verify(
                'HMAC',
                key,
                unbase64(signature),
                encoder.encode(data),
            ))
        ) {
            return null;
        }
        const payload = object(
            JSON.parse(new TextDecoder().decode(unbase64(data))),
        );
        return typeof payload.exp === 'number' &&
            payload.exp > Date.now() / 1000
            ? payload
            : null;
    } catch {
        return null;
    }
}

export async function isAdmin(
    request: Request,
    env: Environment,
): Promise<boolean> {
    const password = setting(env, 'ADMIN_PASSWORD');
    if (!password) {
        return false;
    }
    const payload = await verify(env, cookie(request, 'bm_admin'));
    return (
        payload?.role === 'admin' && payload.password === (await hash(password))
    );
}

export async function passwordMatches(
    input: string,
    expected: string,
): Promise<boolean> {
    if (!expected) {
        return false;
    }
    const left = await hash(input),
        right = await hash(expected);
    let difference = 0;
    for (let index = 0; index < left.length; index++) {
        difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return difference === 0;
}

export function checkOrigin(request: Request): void {
    const expected = new URL(request.url).origin;
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    if (
        origin
            ? origin !== expected
            : !referer || new URL(referer).origin !== expected
    ) {
        throw new AppError(403, 'Request origin could not be verified.');
    }
}

export function localRedirect(value: unknown, fallback = '/'): string {
    const path = text(value, fallback);
    if (
        !path.startsWith('/') ||
        path.startsWith('//') ||
        /[\\\r\n]/.test(path)
    ) {
        return fallback;
    }
    const parsed = new URL(path, 'https://local.invalid');
    return parsed.origin === 'https://local.invalid'
        ? parsed.pathname + parsed.search
        : fallback;
}

export function watchRedirect(value: unknown): string {
    const path = localRedirect(value, '');
    if (
        !/^\/(?:movie\/\d+\/[a-z0-9-]+\/watch|series\/\d+\/[a-z0-9-]+\/watch(?:\/\d+(?:\/\d+)?)?)$/.test(
            path,
        ) &&
        !/^\/series\/\d+\/[a-z0-9-]+\/watch\/\d+\/\d+\?resume=next$/.test(path)
    ) {
        throw new AppError(404, 'Page not found.');
    }
    return path;
}

export async function encrypt(
    env: Environment,
    value: JsonObject,
): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        await crypto.subtle.digest('SHA-256', encoder.encode(secret(env))),
        'AES-GCM',
        false,
        ['encrypt'],
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(JSON.stringify(value)),
    );
    return `${base64(iv)}.${base64(new Uint8Array(data))}`;
}

export async function decrypt(
    env: Environment,
    value: string,
): Promise<JsonObject> {
    try {
        const [iv, data] = value.split('.');
        const key = await crypto.subtle.importKey(
            'raw',
            await crypto.subtle.digest('SHA-256', encoder.encode(secret(env))),
            'AES-GCM',
            false,
            ['decrypt'],
        );
        const decoded = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: unbase64(iv) },
            key,
            unbase64(data),
        );
        return object(JSON.parse(new TextDecoder().decode(decoded)));
    } catch {
        throw new AppError(
            503,
            'Stored TMDB credentials cannot be read. Reconnect the account.',
        );
    }
}
