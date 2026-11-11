import {
    AppError,
    pageNumber,
    positiveId,
    rows,
    setting,
    text,
    type JsonObject,
    type MediaType,
} from './types.ts';
import { back, body, json, redirect } from './http.ts';
import {
    cookie,
    hash,
    passwordMatches,
    setCookie,
    sign,
    verify,
} from './security.ts';
import type { Context } from './context.ts';
import { protectionEnabled } from './watch.ts';

export async function adminRoute(ctx: Context): Promise<Response | null> {
    const {
        request,
        url,
        env,
        account,
        client,
        catalog,
        players,
        store,
        page,
    } = ctx;
    const path = url.pathname,
        method = request.method;
    if (!path.startsWith('/admin/')) {
        return null;
    }
    if (path === '/admin/login') {
        if (method === 'GET') {
            return ctx.admin
                ? redirect('/admin/watchlist')
                : page('admin/login', {});
        }
        if (method !== 'POST') {
            throw new AppError(405, 'Method not allowed.');
        }
        await store.limit(
            `admin-login:${request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown'}`,
            5,
            300,
        );
        const input = await body(request);
        if (!setting(env, 'ADMIN_PASSWORD')) {
            throw new AppError(503, 'ADMIN_PASSWORD is not configured.');
        }
        if (
            !(await passwordMatches(
                text(input.password).slice(0, 1024),
                setting(env, 'ADMIN_PASSWORD'),
            ))
        ) {
            return page('admin/login', {}, 200, {
                password:
                    ctx.locale === 'ro'
                        ? 'Parolă incorectă.'
                        : 'Incorrect password.',
            });
        }
        return redirect('/admin/watchlist', {
            'Set-Cookie': setCookie(
                request,
                'bm_admin',
                await sign(
                    env,
                    {
                        role: 'admin',
                        password: await hash(setting(env, 'ADMIN_PASSWORD')),
                    },
                    86400,
                ),
                86400,
            ),
        });
    }
    if (!ctx.admin) {
        return redirect('/admin/login');
    }
    if (path === '/admin/logout' && method === 'POST') {
        return redirect('/', {
            'Set-Cookie': setCookie(request, 'bm_admin', '', 0),
        });
    }
    const input = method === 'GET' ? {} : await body(request);
    if (path === '/admin/watch-protection') {
        if (method === 'GET') {
            return page('admin/watch-protection', {
                enabled: await protectionEnabled(store, env),
            });
        }
        if (method === 'PATCH') {
            if (
                !['0', '1', 0, 1, true, false].includes(
                    input.is_enabled as string,
                )
            ) {
                throw new AppError(422, 'Invalid protection status.');
            }
            store.requireDurable();
            await store.set(
                'watch-protection',
                [true, 1, '1'].includes(input.is_enabled as boolean),
            );
            return redirect(back(request));
        }
    }
    if (path === '/admin/player-servers' && method === 'GET') {
        return page('admin/player-servers', {
            servers: (await players.all()).sort(
                (left, right) => Number(right.priority) - Number(left.priority),
            ),
            defaultServerKey: setting(env, 'VIDEO_PLAYER_DEFAULT', 'super'),
        });
    }
    if (path === '/admin/player-servers' && method === 'POST') {
        await players.save(input);
        return redirect('/admin/player-servers');
    }
    const server = path.match(/^\/admin\/player-servers\/(\d+)$/);
    if (server && method === 'PATCH') {
        await players.save(input, positiveId(server[1]));
        return redirect('/admin/player-servers');
    }
    if (path === '/admin/logs' && method === 'GET') {
        const events = (await store.get<JsonObject[]>('events')) ?? [];
        const content = events.map((event) => JSON.stringify(event)).join('\n');
        return page('admin/logs', {
            files: [
                {
                    name: 'serverless.log',
                    size: new TextEncoder().encode(content).length,
                    updatedAt: Number(events.at(-1)?.at) || Date.now(),
                },
            ],
            selected: 'serverless.log',
            content,
        });
    }
    if (path === '/admin/logs/serverless.log/clear' && method === 'PATCH') {
        await store.delete('events');
        return redirect('/admin/logs');
    }
    if (path === '/admin/watchlist' && method === 'GET') {
        const index = pageNumber(url.searchParams.get('page'));
        const [movies, series] = await Promise.all([
            account.list('watchlist', 'movies', index),
            account.list('watchlist', 'tv', index),
        ]);
        return page('admin/watchlist', { movies, series });
    }
    const watchlist = path.match(/^\/admin\/watchlist\/(movie|tv)\/(\d+)$/);
    if (watchlist && ['POST', 'DELETE'].includes(method)) {
        await account.updateWatchlist(
            watchlist[1] as MediaType,
            positiveId(watchlist[2]),
            method === 'POST',
        );
        if (method === 'POST') {
            await account.scanEpisodes();
        }
        return redirect(back(request));
    }
    if (path === '/admin/tmdb/connect' && method === 'GET') {
        store.requireDurable();
        await store.limit('tmdb-connect', 5, 60);
        const data = await client.request(
            '/authentication/token/new',
            {},
            { private: true },
        );
        if (!text(data.request_token)) {
            throw new AppError(
                502,
                'TMDB did not issue an authorization request.',
            );
        }
        const callback = new URL('/admin/tmdb/callback', url.origin).toString();
        const target = `https://www.themoviedb.org/authenticate/${encodeURIComponent(text(data.request_token))}?redirect_to=${encodeURIComponent(callback)}`;
        const headers = new Headers({
            'Set-Cookie': setCookie(
                request,
                'bm_tmdb_pending',
                await sign(env, { requestToken: data.request_token }, 600),
                600,
            ),
        });
        if (request.headers.get('X-Inertia')) {
            headers.set('X-Inertia-Location', target);
            return new Response(null, { status: 409, headers });
        }
        return redirect(target, headers);
    }
    if (path === '/admin/tmdb/callback' && method === 'GET') {
        const pending = await verify(env, cookie(request, 'bm_tmdb_pending'));
        const token = url.searchParams.get('request_token');
        if (
            !token ||
            pending?.requestToken !== token ||
            url.searchParams.get('approved') !== 'true'
        ) {
            throw new AppError(403, 'TMDB authorization was not approved.');
        }
        const result = await client.request(
            '/authentication/session/new',
            {},
            { method: 'POST', private: true, body: { request_token: token } },
        );
        if (!text(result.session_id)) {
            throw new AppError(502, 'TMDB did not create a session.');
        }
        await account.connect(text(result.session_id));
        return redirect('/admin/tmdb', {
            'Set-Cookie': setCookie(request, 'bm_tmdb_pending', '', 0),
        });
    }
    if (path === '/admin/tmdb/connect' && method === 'DELETE') {
        await account.disconnect();
        return redirect('/admin/tmdb');
    }
    if (path === '/admin/tmdb' && method === 'GET') {
        const section = ['favorites', 'ratings', 'lists', 'search'].includes(
            url.searchParams.get('section') ?? '',
        )
            ? url.searchParams.get('section')!
            : 'favorites';
        const index = pageNumber(url.searchParams.get('page'));
        const query = (url.searchParams.get('q') ?? '').slice(0, 200).trim();
        const connection = await account.status();
        let data: JsonObject = {},
            available = true;
        try {
            if (section === 'search') {
                const result =
                    query.length < 2
                        ? null
                        : catalog.paginated(
                              await client.request(
                                  '/search/multi',
                                  catalog.options({ query, page: index }),
                              ),
                          );
                if (result) {
                    result.items = rows(result.items).filter((item) =>
                        ['movie', 'tv'].includes(text(item.media_type)),
                    );
                }
                data = { results: result };
            } else if (section === 'lists') {
                const auth = await account.context();
                const lists = catalog.paginated(
                    await client.request(
                        `/account/${auth.id}/lists`,
                        { session_id: auth.session, page: index },
                        { private: true },
                    ),
                );
                const selected = url.searchParams.get('list')
                    ? await client.request(
                          `/list/${positiveId(url.searchParams.get('list'))}`,
                          {},
                          { private: true },
                      )
                    : null;
                data = { lists, selected };
            } else {
                const kind = section === 'ratings' ? 'rated' : 'favorite';
                const [movies, series] = await Promise.all([
                    account.list(kind, 'movies', index),
                    account.list(kind, 'tv', index),
                ]);
                data = {
                    movies,
                    series,
                    ...(section === 'ratings'
                        ? {
                              episodes: await account.list(
                                  'rated',
                                  'tv/episodes',
                                  index,
                              ),
                          }
                        : {}),
                };
            }
            connection.connected = true;
            if (!connection.source) {
                connection.source = 'bearer';
            }
        } catch (error) {
            if (!(error instanceof AppError)) {
                throw error;
            }
            available = false;
        }
        return page('admin/tmdb', {
            section,
            data,
            available,
            query,
            v4ListsConfigured: Boolean(
                setting(env, 'TMDB_USER_ACCESS_TOKEN') &&
                setting(env, 'TMDB_ACCOUNT_OBJECT_ID'),
            ),
            connection,
        });
    }
    const favorite = path.match(
        /^\/admin\/tmdb\/favorites\/(movie|tv)\/(\d+)$/,
    );
    if (favorite && ['POST', 'DELETE'].includes(method)) {
        const auth = await account.context();
        await client.request(
            `/account/${auth.id}/favorite`,
            { session_id: auth.session },
            {
                method: 'POST',
                private: true,
                body: {
                    media_type: favorite[1],
                    media_id: positiveId(favorite[2]),
                    favorite: method === 'POST',
                },
            },
        );
        return redirect(back(request));
    }
    const rating = path.match(
        /^\/admin\/tmdb\/ratings\/(movie|tv)\/(\d+)(?:\/(\d+)\/(\d+))?$/,
    );
    if (rating && ['PUT', 'DELETE'].includes(method)) {
        const auth = await account.context();
        const id = positiveId(rating[2]);
        if (rating[3] && rating[1] !== 'tv') {
            throw new AppError(404, 'Page not found.');
        }
        const target = `/${rating[1]}/${id}${rating[3] ? `/season/${positiveId(rating[3])}/episode/${positiveId(rating[4])}` : ''}/rating`;
        const value = Number(input.value);
        if (
            method === 'PUT' &&
            (value < 0.5 || value > 10 || !Number.isInteger(value * 2))
        ) {
            throw new AppError(
                422,
                'Ratings must be between 0.5 and 10 in increments of 0.5.',
            );
        }
        await client.request(
            target,
            { session_id: auth.session },
            {
                method: method === 'PUT' ? 'POST' : 'DELETE',
                private: true,
                ...(method === 'PUT' ? { body: { value } } : {}),
            },
        );
        return redirect(back(request));
    }
    if (path === '/admin/tmdb/lists' && method === 'POST') {
        const auth = await account.context();
        const name = text(input.name).trim(),
            language = text(input.language, 'en');
        if (
            !name ||
            name.length > 100 ||
            !/^[a-z]{2}$/.test(language) ||
            text(input.description).length > 1000
        ) {
            throw new AppError(
                422,
                'Enter a list name, description and two-letter language.',
            );
        }
        await client.request(
            '/list',
            { session_id: auth.session },
            {
                method: 'POST',
                private: true,
                body: { name, description: text(input.description), language },
            },
        );
        return redirect(back(request));
    }
    const list = path.match(
        /^\/admin\/tmdb\/lists\/(\d+)(?:\/(clear)|\/movies\/(\d+))?$/,
    );
    if (list && ['POST', 'PATCH', 'DELETE'].includes(method)) {
        const auth = await account.context();
        const id = positiveId(list[1]);
        const target = `/list/${id}${list[2] ? '/clear' : list[3] ? (method === 'POST' ? '/add_item' : '/remove_item') : ''}`;
        if (
            (!list[2] && !list[3] && method !== 'DELETE') ||
            (list[2] && method !== 'PATCH') ||
            (list[3] && method === 'PATCH')
        ) {
            throw new AppError(405, 'Method not allowed.');
        }
        await client.request(
            target,
            { session_id: auth.session, ...(list[2] ? { confirm: true } : {}) },
            {
                method: !list[2] && !list[3] ? 'DELETE' : 'POST',
                private: true,
                ...(list[3] ? { body: { media_id: positiveId(list[3]) } } : {}),
            },
        );
        return redirect(back(request));
    }
    if (path === '/admin/scan-episodes' && method === 'POST') {
        return json({ episodes: await account.scanEpisodes() });
    }
    throw new AppError(404, 'Page not found.');
}
