import { ConfirmActionForm } from '@/components/confirm-action';
import { useTranslation } from '@/hooks/use-translation';
import { Form, Link } from '@inertiajs/react';
import {
    BookmarkPlus,
    Film,
    Heart,
    ListPlus,
    Search,
    ShieldCheck,
    Star,
    Trash2,
    Tv,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { SeoHead } from '@/components/seo-head';
import {
    create as connectTmdb,
    destroy as disconnectTmdb,
} from '@/routes/admin/tmdb/connection';
import {
    destroy as removeFavorite,
    store as addFavorite,
} from '@/routes/admin/tmdb/favorites';
import {
    destroy as removeRating,
    update as updateRating,
} from '@/routes/admin/tmdb/ratings';
import { destroy as removeEpisodeRating } from '@/routes/admin/tmdb/episode-ratings';
import {
    clear as clearList,
    destroy as deleteList,
    store as createList,
} from '@/routes/admin/tmdb/lists';
import {
    destroy as removeListMovie,
    store as addListMovie,
} from '@/routes/admin/tmdb/lists/movies';
import { index } from '@/routes/admin/tmdb';
import { store as addWatchlist } from '@/routes/admin/watchlist';
import { show as movieShow } from '@/routes/movies';
import { show as seriesShow } from '@/routes/series';

type Item = {
    id: number;
    media_type?: 'movie' | 'tv';
    title?: string;
    name?: string;
    poster_path?: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
    rating?: number;
    season_number?: number;
    episode_number?: number;
    show_id?: number;
};

type Page<T = Item> = {
    items: T[];
    page: number;
    totalPages: number;
    totalResults: number;
};
type ListItem = {
    id: number;
    name?: string;
    description?: string;
    item_count?: number;
};
type SelectedList = {
    id: number;
    name?: string;
    description?: string;
    items?: Item[];
    item_count?: number;
};
type Data = {
    movies?: Page;
    series?: Page;
    episodes?: Page;
    lists?: Page<ListItem>;
    selected?: SelectedList | null;
    results?: Page | null;
};
type Connection = {
    connected: boolean;
    accountId: number;
    username: string | null;
    connectedAt: string | null;
    source: 'database' | 'environment' | 'bearer' | null;
};

const sections = [
    { id: 'favorites', label: 'Favorites' },
    { id: 'ratings', label: 'Ratings' },
    { id: 'lists', label: 'Lists' },
    { id: 'search', label: 'Find & manage' },
] as const;

const mediaType = (item: Item, fallback: 'movie' | 'tv'): 'movie' | 'tv' =>
    item.media_type ?? fallback;
const title = (item: Item, fallback: string) =>
    item.title ?? item.name ?? fallback;
const details = (item: Item, fallback: 'movie' | 'tv') =>
    mediaType(item, fallback) === 'movie'
        ? movieShow(item.id)
        : seriesShow(item.id);

function MediaRow({
    item,
    type,
    action,
}: {
    item: Item;
    type: 'movie' | 'tv';
    action?: React.ReactNode;
}) {
    const { t, localeTag } = useTranslation();
    return (
        <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-3">
            <Link
                href={details(item, type)}
                className="grid h-24 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-900 text-slate-700"
            >
                {item.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                        alt={title(item, t('Untitled'))}
                        className="size-full object-cover"
                    />
                ) : (
                    <Film className="size-6" />
                )}
            </Link>
            <div className="min-w-0 flex-1">
                <Link
                    href={details(item, type)}
                    className="block truncate font-bold hover:text-sky-300"
                >
                    {title(item, t('Untitled'))}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                    {(item.release_date ?? item.first_air_date ?? '').slice(
                        0,
                        4,
                    ) || '—'}{' '}
                    {t('· TMDB #')}
                    {item.id}
                </p>
                {(item.rating ?? 0) > 0 && (
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="size-3 fill-current" />{' '}
                        {t('Your rating:')}{' '}
                        {item.rating?.toLocaleString(localeTag)}
                    </p>
                )}
            </div>
            {action}
        </article>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/8 bg-white/[.025] p-10 text-center text-sm text-slate-500">
            {children}
        </div>
    );
}

function Pagination({
    page,
    section,
    query,
    list,
}: {
    page?: Page;
    section: string;
    query: string;
    list?: number;
}) {
    const { t } = useTranslation();
    if (!page || page.totalPages <= 1) {
        return null;
    }

    const parameters = (targetPage: number) => ({
        section,
        page: targetPage,
        ...(query ? { q: query } : {}),
        ...(list ? { list } : {}),
    });

    return (
        <nav
            className="mt-8 flex items-center justify-center gap-3 text-sm font-bold"
            aria-label={t('Pagination')}
        >
            {page.page > 1 && (
                <Link
                    href={index({ query: parameters(page.page - 1) })}
                    className="rounded-xl border border-white/10 px-4 py-2 hover:text-sky-300"
                >
                    {t('Previous')}{' '}
                </Link>
            )}
            <span className="text-slate-500">
                {t('Page')} {page.page} {t('of')} {page.totalPages}
            </span>
            {page.page < page.totalPages && (
                <Link
                    href={index({ query: parameters(page.page + 1) })}
                    className="rounded-xl border border-white/10 px-4 py-2 hover:text-sky-300"
                >
                    {t('Next')}{' '}
                </Link>
            )}
        </nav>
    );
}

function Favorites({ data }: { data: Data }) {
    const { t } = useTranslation();
    return (
        <div className="grid gap-8 xl:grid-cols-2">
            {(['movies', 'series'] as const).map((group) => {
                const type = group === 'movies' ? 'movie' : 'tv';
                const page = data[group];

                return (
                    <section key={group}>
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
                            {type === 'movie' ? (
                                <Film className="size-5 text-sky-400" />
                            ) : (
                                <Tv className="size-5 text-sky-400" />
                            )}
                            {type === 'movie'
                                ? t('Favorite movies')
                                : t('Favorite TV shows')}
                        </h2>
                        <div className="space-y-3">
                            {page?.items.map((item) => (
                                <MediaRow
                                    key={item.id}
                                    item={item}
                                    type={type}
                                    action={
                                        <ConfirmActionForm
                                            confirmation={{
                                                title: t(
                                                    'Remove from favorites?',
                                                ),
                                                description: t(
                                                    'Remove “:title” from favorites?',
                                                    {
                                                        title: title(
                                                            item,
                                                            t('Untitled'),
                                                        ),
                                                    },
                                                ),
                                                label: t('Remove'),
                                            }}
                                            action={removeFavorite({
                                                mediaType: type,
                                                mediaId: item.id,
                                            })}
                                            options={{ preserveScroll: true }}
                                        >
                                            {({ processing }) => (
                                                <button
                                                    disabled={processing}
                                                    aria-label={t(
                                                        'Remove :title from favorites',
                                                        {
                                                            title: title(
                                                                item,
                                                                t('Untitled'),
                                                            ),
                                                        },
                                                    )}
                                                    className="cursor-pointer rounded-xl p-3 text-rose-300 hover:bg-rose-400/10 disabled:opacity-50"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            )}
                                        </ConfirmActionForm>
                                    }
                                />
                            ))}
                            {page?.items.length === 0 && (
                                <Empty>{t('No favorites here.')}</Empty>
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

function Ratings({ data }: { data: Data }) {
    const { t } = useTranslation();
    return (
        <div className="space-y-10">
            {(['movies', 'series'] as const).map((group) => {
                const type = group === 'movies' ? 'movie' : 'tv';
                const page = data[group];

                return (
                    <section key={group}>
                        <h2 className="mb-4 text-xl font-black">
                            {type === 'movie'
                                ? t('Rated movies')
                                : t('Rated TV shows')}
                        </h2>
                        <div className="grid gap-3 xl:grid-cols-2">
                            {page?.items.map((item) => (
                                <MediaRow
                                    key={item.id}
                                    item={item}
                                    type={type}
                                    action={
                                        <ConfirmActionForm
                                            confirmation={{
                                                title: t('Delete rating?'),
                                                description: t(
                                                    'Delete your rating for “:title”?',
                                                    {
                                                        title: title(
                                                            item,
                                                            t('Untitled'),
                                                        ),
                                                    },
                                                ),
                                                label: t('Delete'),
                                            }}
                                            action={removeRating({
                                                mediaType: type,
                                                mediaId: item.id,
                                            })}
                                            options={{ preserveScroll: true }}
                                        >
                                            {({ processing }) => (
                                                <button
                                                    disabled={processing}
                                                    aria-label={t(
                                                        'Delete rating for :title',
                                                        {
                                                            title: title(
                                                                item,
                                                                t('Untitled'),
                                                            ),
                                                        },
                                                    )}
                                                    className="cursor-pointer rounded-xl p-3 text-rose-300 hover:bg-rose-400/10 disabled:opacity-50"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            )}
                                        </ConfirmActionForm>
                                    }
                                />
                            ))}
                        </div>
                    </section>
                );
            })}
            <section>
                <h2 className="mb-4 text-xl font-black">
                    {t('Rated episodes')}
                </h2>
                <div className="grid gap-3 xl:grid-cols-2">
                    {data.episodes?.items.map((item) => (
                        <article
                            key={`${item.show_id}-${item.season_number}-${item.episode_number}`}
                            className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-4"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">
                                    {title(item, t('Untitled'))}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {t('Show #')}
                                    {item.show_id} {t('· S')}
                                    {item.season_number} {t('E')}
                                    {item.episode_number} {t('· Rating')}{' '}
                                    {item.rating}
                                </p>
                            </div>
                            {item.show_id !== undefined &&
                                item.season_number !== undefined &&
                                item.episode_number !== undefined && (
                                    <ConfirmActionForm
                                        confirmation={{
                                            title: t('Delete rating?'),
                                            description: t(
                                                'Delete your rating for “:title”?',
                                                {
                                                    title: title(
                                                        item,
                                                        t('Untitled'),
                                                    ),
                                                },
                                            ),
                                            label: t('Delete'),
                                        }}
                                        action={removeEpisodeRating({
                                            series: item.show_id,
                                            season: item.season_number,
                                            episode: item.episode_number,
                                        })}
                                        options={{ preserveScroll: true }}
                                    >
                                        <button
                                            aria-label={t(
                                                'Delete rating for :title',
                                                {
                                                    title: title(
                                                        item,
                                                        t('Untitled'),
                                                    ),
                                                },
                                            )}
                                            className="cursor-pointer rounded-xl p-3 text-rose-300 hover:bg-rose-400/10"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </ConfirmActionForm>
                                )}
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

function Lists({
    data,
    v4ListsConfigured,
}: {
    data: Data;
    v4ListsConfigured: boolean;
}) {
    const { t, locale } = useTranslation();
    const [movieId, setMovieId] = useState('');

    return (
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <div className="space-y-5">
                <Form
                    action={createList()}
                    className="rounded-2xl border border-white/8 bg-white/[.025] p-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <h2 className="flex items-center gap-2 font-black">
                                <ListPlus className="size-4 text-sky-400" />{' '}
                                {t('Create a list')}{' '}
                            </h2>
                            <input
                                name="name"
                                required
                                placeholder={t('List name')}
                                className="mt-4 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm outline-none focus:border-sky-400"
                            />
                            <textarea
                                name="description"
                                placeholder={t('Description')}
                                className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-sky-400"
                            />
                            <input
                                type="hidden"
                                name="language"
                                value={locale}
                            />
                            {Object.values(errors).map((error) => (
                                <p
                                    key={error}
                                    className="mt-2 text-xs text-rose-300"
                                >
                                    {error}
                                </p>
                            ))}
                            <button
                                disabled={processing}
                                className="mt-3 w-full cursor-pointer rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50"
                            >
                                {t('Create list')}{' '}
                            </button>
                        </>
                    )}
                </Form>
                <div className="rounded-2xl border border-white/8 bg-white/[.025] p-3">
                    <h2 className="px-2 py-2 font-black">{t('Your lists')}</h2>
                    {data.lists?.items.map((list) => (
                        <Link
                            key={list.id}
                            href={index({
                                query: { section: 'lists', list: list.id },
                            })}
                            className="mt-1 block rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                            <span className="block font-bold">
                                {list.name ?? t('List #:id', { id: list.id })}
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                                {list.item_count ?? 0} {t('items')}{' '}
                            </span>
                        </Link>
                    ))}
                    {data.lists?.items.length === 0 && (
                        <p className="p-4 text-center text-sm text-slate-500">
                            {t('No custom lists.')}{' '}
                        </p>
                    )}
                </div>
                <p className="rounded-xl border border-white/8 px-4 py-3 text-xs leading-5 text-slate-500">
                    {t('TMDB v4 mixed lists:')}{' '}
                    {v4ListsConfigured
                        ? t('user token configured')
                        : t(
                              'optional — configure TMDB_USER_ACCESS_TOKEN and TMDB_ACCOUNT_OBJECT_ID',
                          )}
                    .
                </p>
            </div>
            {data.selected ? (
                <section>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black">
                                {data.selected.name ??
                                    t('List #:id', { id: data.selected.id })}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                {data.selected.description ||
                                    t('No description.')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <ConfirmActionForm
                                confirmation={{
                                    title: t('Clear list?'),
                                    description: t(
                                        'Remove all entries from “:name”?',
                                        {
                                            name:
                                                data.selected.name ??
                                                t('Untitled'),
                                        },
                                    ),
                                    label: t('Clear'),
                                }}
                                action={clearList(data.selected.id)}
                            >
                                <button className="cursor-pointer rounded-xl border border-amber-400/20 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/10">
                                    {t('Clear')}{' '}
                                </button>
                            </ConfirmActionForm>
                            <ConfirmActionForm
                                confirmation={{
                                    title: t('Delete list?'),
                                    description: t(
                                        'Permanently delete “:name” and all its entries?',
                                        {
                                            name:
                                                data.selected.name ??
                                                t('Untitled'),
                                        },
                                    ),
                                    label: t('Delete'),
                                }}
                                action={deleteList(data.selected.id)}
                            >
                                <button className="cursor-pointer rounded-xl border border-rose-400/20 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/10">
                                    {t('Delete')}{' '}
                                </button>
                            </ConfirmActionForm>
                        </div>
                    </div>
                    <Form
                        action={addListMovie({
                            list: data.selected.id,
                            movie: Number(movieId) || 0,
                        })}
                        options={{ preserveScroll: true }}
                        className="mt-5 flex max-w-md gap-2"
                    >
                        {({ processing }) => (
                            <>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={movieId}
                                    onChange={(event) =>
                                        setMovieId(event.target.value)
                                    }
                                    placeholder={t('TMDB movie ID')}
                                    className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[.04] px-3 text-sm outline-none focus:border-sky-400"
                                />
                                <button
                                    disabled={
                                        processing || Number(movieId) <= 0
                                    }
                                    className="cursor-pointer rounded-xl bg-sky-500 px-4 text-sm font-bold text-white disabled:opacity-50"
                                >
                                    {t('Add movie')}{' '}
                                </button>
                            </>
                        )}
                    </Form>
                    <div className="mt-5 grid gap-3 xl:grid-cols-2">
                        {(data.selected.items ?? []).map((item) => (
                            <MediaRow
                                key={item.id}
                                item={item}
                                type="movie"
                                action={
                                    <ConfirmActionForm
                                        confirmation={{
                                            title: t('Remove from list?'),
                                            description: t(
                                                'Remove “:title” from this list?',
                                                {
                                                    title: title(
                                                        item,
                                                        t('Untitled'),
                                                    ),
                                                },
                                            ),
                                            label: t('Remove'),
                                        }}
                                        action={removeListMovie({
                                            list: data.selected!.id,
                                            movie: item.id,
                                        })}
                                        options={{ preserveScroll: true }}
                                    >
                                        <button
                                            aria-label={t(
                                                'Remove :title from list',
                                                {
                                                    title: title(
                                                        item,
                                                        t('Untitled'),
                                                    ),
                                                },
                                            )}
                                            className="cursor-pointer rounded-xl p-3 text-rose-300 hover:bg-rose-400/10"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </ConfirmActionForm>
                                }
                            />
                        ))}
                    </div>
                </section>
            ) : (
                <Empty>
                    {t('Select a list to inspect and manage its movies.')}
                </Empty>
            )}
        </div>
    );
}

function SearchManager({ data, query }: { data: Data; query: string }) {
    const { t } = useTranslation();
    return (
        <section>
            <Form action={index()} method="get" className="flex gap-3">
                <input type="hidden" name="section" value="search" />
                <div className="relative max-w-2xl flex-1">
                    <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                        name="q"
                        defaultValue={query}
                        minLength={2}
                        required
                        placeholder={t('Search movies or TV shows')}
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[.04] pr-4 pl-11 outline-none focus:border-sky-400"
                    />
                </div>
                <button className="cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-black text-white">
                    {t('Search')}{' '}
                </button>
            </Form>
            <div className="mt-6 grid gap-3 xl:grid-cols-2">
                {data.results?.items.map((item) => {
                    const type = mediaType(item, 'movie');
                    return (
                        <MediaRow
                            key={`${type}-${item.id}`}
                            item={item}
                            type={type}
                            action={
                                <div className="flex shrink-0 flex-col gap-1">
                                    <Form
                                        action={addFavorite({
                                            mediaType: type,
                                            mediaId: item.id,
                                        })}
                                        options={{ preserveScroll: true }}
                                    >
                                        <button
                                            title={t('Add to favorites')}
                                            className="cursor-pointer rounded-lg p-2 text-pink-300 hover:bg-pink-400/10"
                                        >
                                            <Heart className="size-4" />
                                        </button>
                                    </Form>
                                    <Form
                                        action={addWatchlist({
                                            mediaType: type,
                                            mediaId: item.id,
                                        })}
                                        options={{ preserveScroll: true }}
                                    >
                                        <button
                                            title={t('Add to watchlist')}
                                            className="cursor-pointer rounded-lg p-2 text-sky-300 hover:bg-sky-400/10"
                                        >
                                            <BookmarkPlus className="size-4" />
                                        </button>
                                    </Form>
                                    <Form
                                        action={updateRating({
                                            mediaType: type,
                                            mediaId: item.id,
                                        })}
                                        options={{ preserveScroll: true }}
                                        className="flex items-center gap-1"
                                    >
                                        <select
                                            name="value"
                                            defaultValue="8"
                                            aria-label={t('Rating for :title', {
                                                title: title(
                                                    item,
                                                    t('Untitled'),
                                                ),
                                            })}
                                            className="rounded-lg border border-white/10 bg-[#0d1728] p-1 text-xs text-slate-300"
                                        >
                                            {Array.from(
                                                { length: 20 },
                                                (_, index) => (index + 1) / 2,
                                            ).map((value) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            title={t('Save rating')}
                                            className="cursor-pointer rounded-lg p-2 text-amber-300 hover:bg-amber-400/10"
                                        >
                                            <Star className="size-4" />
                                        </button>
                                    </Form>
                                </div>
                            }
                        />
                    );
                })}
            </div>
            {query.length >= 2 && data.results?.items.length === 0 && (
                <div className="mt-6">
                    <Empty>{t('No matching movies or TV shows.')}</Empty>
                </div>
            )}
            {query.length < 2 && (
                <div className="mt-6">
                    <Empty>
                        {t(
                            'Search TMDB, then add a title to favorites, Watchlist, a custom list, or rate it.',
                        )}{' '}
                    </Empty>
                </div>
            )}
        </section>
    );
}

export default function AdminTmdb({
    section,
    data,
    available,
    query,
    v4ListsConfigured,
    connection,
}: {
    section: string;
    data: Data;
    available: boolean;
    query: string;
    v4ListsConfigured: boolean;
    connection: Connection;
}) {
    const { t } = useTranslation();
    const pagination = data.results ?? data.movies ?? data.lists;

    return (
        <AdminLayout active="tmdb">
            <SeoHead title={t('TMDB account admin')} />
            <section
                className={`mb-7 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${connection.connected ? 'border-emerald-400/20 bg-emerald-400/[.08]' : 'border-amber-400/20 bg-amber-400/[.08]'}`}
            >
                <div className="flex items-start gap-3">
                    <ShieldCheck
                        className={`mt-0.5 size-5 shrink-0 ${connection.connected ? 'text-emerald-300' : 'text-amber-300'}`}
                    />
                    <div>
                        <h2 className="font-black">
                            {connection.connected
                                ? t('TMDB account connected')
                                : t('TMDB account authorization required')}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            {connection.connected
                                ? `${connection.username ?? t('Account #:id', { id: connection.accountId })} · ${connection.source === 'bearer' ? t('Connected using the API token.') : connection.source === 'database' ? t('Credentials stored securely.') : t('Credentials stored in the environment.')}`
                                : t(
                                      'Connect once to enable Watchlist, favorites, ratings, lists and episode scanning.',
                                  )}
                        </p>
                    </div>
                </div>
                {connection.connected && connection.source === 'database' ? (
                    <ConfirmActionForm
                        confirmation={{
                            title: t('Disconnect account?'),
                            description: t(
                                'Disconnect the connected account from this website?',
                            ),
                            label: t('Disconnect'),
                        }}
                        action={disconnectTmdb()}
                    >
                        {({ processing }) => (
                            <button
                                disabled={processing}
                                className="cursor-pointer rounded-xl border border-rose-400/25 px-4 py-2.5 text-sm font-bold text-rose-300 hover:bg-rose-400/10 disabled:opacity-50"
                            >
                                {t('Disconnect')}{' '}
                            </button>
                        )}
                    </ConfirmActionForm>
                ) : !connection.connected ? (
                    <a
                        href={connectTmdb.url()}
                        className="shrink-0 rounded-xl bg-sky-500 px-5 py-2.5 text-center text-sm font-black text-white transition hover:bg-sky-400"
                    >
                        {t('Connect TMDB')}{' '}
                    </a>
                ) : null}
            </section>
            <div className="mb-7 flex flex-wrap gap-2">
                {sections.map((item) => (
                    <Link
                        key={item.id}
                        href={index({ query: { section: item.id } })}
                        className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${section === item.id ? 'bg-white text-slate-950' : 'border border-white/10 text-slate-400 hover:text-white'}`}
                    >
                        {t(item.label)}
                    </Link>
                ))}
            </div>
            {!available ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-8 text-center text-amber-100">
                    {t(
                        'TMDB account data is unavailable. Check the account ID, API token, session ID and permissions.',
                    )}{' '}
                </div>
            ) : section === 'ratings' ? (
                <Ratings data={data} />
            ) : section === 'lists' ? (
                <Lists data={data} v4ListsConfigured={v4ListsConfigured} />
            ) : section === 'search' ? (
                <SearchManager data={data} query={query} />
            ) : (
                <Favorites data={data} />
            )}
            {available && (
                <Pagination
                    page={pagination}
                    section={section}
                    query={query}
                    list={data.selected?.id}
                />
            )}
        </AdminLayout>
    );
}
