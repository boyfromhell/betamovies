import { adminRoute } from './admin.ts';
import { back, body, inertia, json, redirect, translate } from './http.ts';
import {
    cookie,
    checkOrigin,
    isAdmin,
    localRedirect,
    passwordMatches,
    watchRedirect,
} from './security.ts';
import { StateStore } from './state.ts';
import {
    AppError,
    object,
    pageNumber,
    positiveId,
    setting,
    text,
    type Environment,
    type JsonObject,
    type Locale,
    type MediaType,
} from './types.ts';
import { TmdbClient } from './tmdb/client.ts';
import { Catalog } from './tmdb/catalog.ts';
import { Account } from './tmdb/account.ts';
import { Players } from './players.ts';
import {
    hasWatchAccess,
    protectionEnabled,
    verifyTurnstile,
    watchPage,
} from './watch.ts';
import { seo } from './seo.ts';
import type { Context } from './context.ts';
import { continueWatchingEpisode } from './continue-watching.ts';

export async function handle(
    input: Request,
    env: Environment = {},
    http: typeof fetch = fetch,
): Promise<Response> {
    let request = input;
    let url = new URL(request.url);
    if (url.pathname === '/api/page') {
        const destination = url.searchParams.get('path');
        if (
            !destination ||
            localRedirect(destination, '') !== destination ||
            request.method !== 'GET'
        ) {
            return json({ message: 'Invalid page path.' }, 400);
        }
        request = new Request(new URL(destination, url.origin), request);
        url = new URL(request.url);
    }
    const locale: Locale = cookie(request, 'locale') === 'ro' ? 'ro' : 'en';
    const store = new StateStore(env, http);
    let admin = false;
    const page = (
        component: string,
        props: JsonObject,
        status = 200,
        errors: JsonObject = {},
    ): Response =>
        inertia(
            request,
            component,
            props,
            {
                locale,
                name: setting(env, 'APP_NAME', 'Beta Movies'),
                auth: {
                    user: admin ? { id: 1, name: 'Admin', email: '' } : null,
                },
                seo: seo(url, env, locale, component, props),
                buildVersion: setting(
                    env,
                    'VERCEL_GIT_COMMIT_SHA',
                    setting(env, 'CF_PAGES_COMMIT_SHA', 'serverless-v1'),
                ),
            },
            status,
            errors,
        );
    try {
        admin = await isAdmin(request, env);
        const client = new TmdbClient(env, store, request.signal, http);
        const catalog = new Catalog(
            client,
            locale,
            setting(env, 'TMDB_REGION', 'US'),
        );
        const account = new Account(catalog, store, env);
        const players = new Players(store, env, http);
        const ctx: Context = {
            request,
            url,
            env,
            locale,
            admin,
            store,
            client,
            catalog,
            account,
            players,
            page,
        };
        const path = url.pathname,
            method = request.method;
        if (path === '/api/scan-episodes') {
            const secret = setting(env, 'CRON_SECRET');
            if (
                !secret ||
                !(await passwordMatches(
                    request.headers.get('authorization') ?? '',
                    `Bearer ${secret}`,
                ))
            ) {
                throw new AppError(401, 'Authentication required.');
            }
            store.requireDurable();
            await store.limit('episode-scan', 1, 60);
            return json({ episodes: await account.scanEpisodes() });
        }
        if (!['GET', 'HEAD'].includes(method)) {
            checkOrigin(request);
        }
        if (path === '/locale' && method === 'POST') {
            const selected = (await body(request)).locale;
            if (selected !== 'en' && selected !== 'ro') {
                throw new AppError(422, 'Invalid language.');
            }
            return redirect(back(request), {
                'Set-Cookie': `locale=${selected}; Path=/; Max-Age=31536000; SameSite=Lax${url.protocol === 'https:' ? '; Secure' : ''}`,
            });
        }
        const adminResponse = await adminRoute(ctx);
        if (adminResponse) {
            return adminResponse;
        }
        const watchlist = path.match(/^\/watchlist\/(movie|tv)\/(\d+)$/);
        if (watchlist) {
            const type = watchlist[1] as MediaType,
                id = positiveId(watchlist[2]);
            if (method === 'GET') {
                return json({
                    watchlisted: await account.watchlisted(type, id),
                });
            }
            if (!admin) {
                throw new AppError(401, 'Authentication required.');
            }
            if (!['POST', 'DELETE'].includes(method)) {
                throw new AppError(405, 'Method not allowed.');
            }
            await account.updateWatchlist(type, id, method === 'POST');
            if (method === 'POST') {
                await account.scanEpisodes();
            }
            return json({ watchlisted: method === 'POST' });
        }
        if (path === '/watch/verify') {
            if (!['GET', 'POST'].includes(method)) {
                throw new AppError(405, 'Method not allowed.');
            }
            const input =
                method === 'POST'
                    ? await body(request)
                    : Object.fromEntries(url.searchParams);
            const destination = watchRedirect(input.redirect);
            if (
                !(await protectionEnabled(store, env)) ||
                (await hasWatchAccess(request, env))
            ) {
                return redirect(destination);
            }
            if (
                !setting(env, 'TURNSTILE_SITE_KEY') ||
                !setting(env, 'TURNSTILE_SECRET_KEY')
            ) {
                throw new AppError(
                    503,
                    'Cloudflare verification is not configured.',
                );
            }
            const props = {
                siteKey: setting(env, 'TURNSTILE_SITE_KEY'),
                action: `watch_${destination.split('/')[1]}_${destination.split('/')[2]}`,
                redirect: destination,
            };
            if (method === 'GET') {
                return page('watch-verification', props);
            }
            await store.limit(
                `turnstile:${request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown'}`,
                10,
                60,
            );
            try {
                return redirect(destination, {
                    'Set-Cookie': await verifyTurnstile(
                        request,
                        env,
                        input,
                        http,
                    ),
                });
            } catch (error) {
                if (!(error instanceof AppError)) {
                    throw error;
                }
                return page('watch-verification', props, 200, {
                    turnstile: translate(locale, error.message),
                });
            }
        }
        if (method !== 'GET' && method !== 'HEAD') {
            throw new AppError(405, 'Method not allowed.');
        }
        if (path === '/catalog/search') {
            await store.limit(
                `search:${request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown'}`,
                60,
                60,
            );
            return json({
                items: await catalog.search(url.searchParams.get('q') ?? ''),
            });
        }
        if (path === '/') {
            return page(
                'welcome',
                await catalog.home(
                    (await store.get<JsonObject[]>('recent-episodes')) ?? [],
                ),
            );
        }
        if (path === '/movies' || path === '/series') {
            return page(
                path === '/movies' ? 'movies/index' : 'series/index',
                await catalog.index(
                    path === '/movies' ? 'movie' : 'tv',
                    url.searchParams,
                ),
            );
        }
        if (path === '/history') {
            return page('history', {});
        }
        if (path === '/contact') {
            return page('contact', {
                appName: setting(env, 'APP_NAME', 'Beta Movies'),
                contactEmail: setting(env, 'MAIL_FROM_ADDRESS'),
            });
        }
        if (path === '/policy' || path === '/terms') {
            return page('legal', {
                document: path.slice(1),
                appName: setting(env, 'APP_NAME', 'Beta Movies'),
                contactEmail: setting(env, 'MAIL_FROM_ADDRESS'),
            });
        }
        if (path === '/watchlist') {
            return page(
                'watchlist',
                await account.watchlist(
                    pageNumber(url.searchParams.get('page')),
                ),
            );
        }
        const detail = path.match(/^\/(movies|series)\/(\d+)$/);
        if (detail) {
            const type = detail[1] === 'movies' ? 'movie' : 'tv';
            const media = await catalog.rawDetails(type, positiveId(detail[2]));
            return page(`${detail[1]}/show`, {
                media: catalog.detailsPayload(media, type),
                mediaType: type,
                watchRoute: catalog.watchRoute(media, type),
            });
        }
        const person = path.match(/^\/people\/(\d+)(?:\/([a-z0-9-]+))?$/);
        if (person) {
            const id = positiveId(person[1]);
            const props = await catalog.person(
                id,
                pageNumber(url.searchParams.get('page')),
            );
            const expected = text(object(props.person).slug);
            if (person[2] !== expected) {
                return redirect(
                    `/people/${id}/${expected}${url.search}`,
                    {},
                    301,
                );
            }
            return page('people/show', props);
        }
        const movieWatch = path.match(/^\/movie\/(\d+)\/([a-z0-9-]+)\/watch$/);
        const seriesWatch = path.match(
            /^\/series\/(\d+)\/([a-z0-9-]+)\/watch(?:\/(\d+)(?:\/(\d+))?)?$/,
        );
        if (movieWatch || seriesWatch) {
            const resumeNext = Boolean(
                seriesWatch?.[4] && url.searchParams.get('resume') === 'next',
            );
            const destination = path + (resumeNext ? '?resume=next' : '');
            if (
                (await protectionEnabled(store, env)) &&
                !(await hasWatchAccess(request, env))
            ) {
                return redirect(
                    `/watch/verify?redirect=${encodeURIComponent(destination)}`,
                );
            }
            const match = (movieWatch ?? seriesWatch)!;
            if (resumeNext) {
                const next = await continueWatchingEpisode(
                    catalog,
                    positiveId(match[1]),
                    Number(seriesWatch![3]),
                    positiveId(seriesWatch![4]),
                );
                return redirect(
                    `/series/${match[1]}/${match[2]}/watch/${next.season}/${next.episode}`,
                );
            }
            return page(
                movieWatch ? 'movies/watch' : 'series/watch',
                await watchPage(
                    catalog,
                    players,
                    movieWatch ? 'movie' : 'tv',
                    positiveId(match[1]),
                    seriesWatch?.[3] ? Number(seriesWatch[3]) : undefined,
                    seriesWatch?.[4] ? positiveId(seriesWatch[4]) : undefined,
                ),
            );
        }
        if (path === '/sitemap.xml') {
            const origin = setting(env, 'APP_URL', url.origin).replace(
                /\/$/,
                '',
            );
            const ids = new Set(
                ((await store.get<JsonObject[]>('recent-episodes')) ?? [])
                    .map((episode) => Number(episode.id))
                    .filter((id) => Number.isSafeInteger(id) && id > 0),
            );
            const escape = (value: string): string =>
                value
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
            const urls = [
                '/',
                '/movies',
                '/series',
                ...[...ids].map((id) => `/series/${id}`),
            ]
                .map(
                    (route) =>
                        `<url><loc>${escape(origin + route)}</loc></url>`,
                )
                .join('');
            return new Response(
                `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
                {
                    headers: {
                        'Content-Type': 'application/xml; charset=utf-8',
                    },
                },
            );
        }
        throw new AppError(404, 'Page not found.');
    } catch (error) {
        const failure =
            error instanceof AppError
                ? error
                : new AppError(500, 'The website is temporarily unavailable.');
        try {
            const events = (await store.get<JsonObject[]>('events')) ?? [];
            events.push({
                at: Date.now(),
                path: url.pathname,
                status: failure.status,
                type: failure.type,
            });
            await store.set('events', events.slice(-100));
        } catch {
            console.warn('Serverless event storage is unavailable.');
        }
        const response =
            url.pathname === '/catalog/search' ||
            /^\/watchlist\/(movie|tv)\//.test(url.pathname) ||
            url.pathname.startsWith('/api/')
                ? json(
                      {
                          message: translate(locale, failure.message),
                          type: failure.type,
                      },
                      failure.status,
                  )
                : page('error', { status: failure.status }, failure.status);
        if (failure.retryAfter !== undefined) {
            response.headers.set('Retry-After', String(failure.retryAfter));
        }
        return response;
    }
}
