import {
    AppError,
    object,
    text,
    type JsonObject,
    type Locale,
} from './types.ts';
import { localRedirect } from './security.ts';
import translations from '../resources/lang/server/ro.json' with { type: 'json' };

export const translate = (locale: Locale, message: string): string =>
    locale === 'ro'
        ? ((translations as Record<string, string>)[message] ?? message)
        : message;

export function json(
    data: unknown,
    status = 200,
    extra: HeadersInit = {},
): Response {
    const headers = new Headers(extra);
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Cache-Control', 'private, no-store');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(JSON.stringify(data), { status, headers });
}

export function redirect(
    location: string,
    extra: HeadersInit = {},
    status = 303,
): Response {
    const headers = new Headers(extra);
    headers.set('Location', location);
    headers.set('Cache-Control', 'private, no-store');
    return new Response(null, { status, headers });
}

export function back(request: Request): string {
    const referer = request.headers.get('referer');
    if (referer && new URL(referer).origin === new URL(request.url).origin) {
        const url = new URL(referer);
        return localRedirect(url.pathname + url.search);
    }
    return '/admin/watchlist';
}

export async function body(request: Request): Promise<JsonObject> {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('multipart/form-data')) {
        return Object.fromEntries(
            [...(await request.formData())].filter(
                (entry): entry is [string, string] =>
                    typeof entry[1] === 'string',
            ),
        );
    }
    const raw = await request.text();
    if (raw.length > 65536) {
        throw new AppError(413, 'Request is too large.');
    }
    if (contentType.includes('application/json')) {
        try {
            return object(JSON.parse(raw));
        } catch {
            throw new AppError(400, 'Invalid JSON request.');
        }
    }
    return Object.fromEntries(new URLSearchParams(raw));
}

export function inertia(
    request: Request,
    component: string,
    props: JsonObject,
    shared: JsonObject,
    status = 200,
    errors: JsonObject = {},
): Response {
    const url = new URL(request.url);
    const catalog = object(props.catalog);
    let pageProps: JsonObject = { ...shared, ...props, errors };
    const only = request.headers.get('x-inertia-partial-data')?.split(',');
    if (
        only?.length &&
        request.headers.get('x-inertia-partial-component') === component
    ) {
        pageProps = Object.fromEntries(
            Object.entries(pageProps).filter(
                ([key]) =>
                    key === 'errors' || key === 'locale' || only.includes(key),
            ),
        );
    }
    const currentPage = Number(catalog.page) || 1;
    const scroll =
        Array.isArray(catalog.items) &&
        ['movies/index', 'series/index', 'watchlist'].includes(component);
    const reset =
        request.headers
            .get('X-Inertia-Reset')
            ?.split(',')
            .includes('catalog') ?? false;
    const version = text(shared.buildVersion, 'serverless-v1');
    return json(
        {
            component,
            props: pageProps,
            url: url.pathname + url.search,
            version,
            clearHistory: false,
            encryptHistory: false,
            rescuedProps: [],
            flash: {},
            ...(scroll
                ? {
                      mergeProps: reset ? [] : ['catalog.items'],
                      scrollProps: {
                          catalog: {
                              pageName: 'page',
                              previousPage:
                                  currentPage > 1 ? currentPage - 1 : null,
                              nextPage:
                                  currentPage < Number(catalog.totalPages)
                                      ? currentPage + 1
                                      : null,
                              currentPage,
                              reset,
                          },
                      },
                  }
                : {}),
        },
        status,
        {
            'X-Inertia': 'true',
            Vary: 'X-Inertia',
            'Content-Language': text(shared.locale, 'en'),
        },
    );
}
