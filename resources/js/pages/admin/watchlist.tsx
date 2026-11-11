import { ConfirmActionForm } from '@/components/confirm-action';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { Film, Star, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin-layout';
import { SeoHead } from '@/components/seo-head';
import { create as connectTmdb } from '@/routes/admin/tmdb/connection';
import { destroy, index } from '@/routes/admin/watchlist';
import { show as movieShow } from '@/routes/movies';
import { show as seriesShow } from '@/routes/series';

type MediaItem = {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
};

type Page = {
    items: MediaItem[];
    page: number;
    totalPages: number;
    totalResults: number;
};

function Collection({
    title,
    type,
    page,
}: {
    title: string;
    type: 'movie' | 'tv';
    page: Page;
}) {
    const { t, localeTag } = useTranslation();
    return (
        <section>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {page.totalResults.toLocaleString(localeTag)}{' '}
                        {t('items')}{' '}
                    </p>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                    {page.page > 1 && (
                        <Link
                            href={index({ query: { page: page.page - 1 } })}
                            className="rounded-lg border border-white/10 px-3 py-2 hover:text-sky-300"
                        >
                            {t('Previous')}{' '}
                        </Link>
                    )}
                    {page.page < page.totalPages && (
                        <Link
                            href={index({ query: { page: page.page + 1 } })}
                            className="rounded-lg border border-white/10 px-3 py-2 hover:text-sky-300"
                        >
                            {t('Next')}{' '}
                        </Link>
                    )}
                </div>
            </div>
            {page.items.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.025] p-8 text-center text-slate-500">
                    {t('No items in this section.')}{' '}
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                    {page.items.map((item) => {
                        const name = item.title ?? item.name ?? t('Untitled');
                        const date =
                            item.release_date ?? item.first_air_date ?? '';
                        const href =
                            type === 'movie'
                                ? movieShow(item.id)
                                : seriesShow(item.id);

                        return (
                            <article
                                key={`${type}-${item.id}`}
                                className="group min-w-0"
                            >
                                <Link
                                    href={href}
                                    className="block aspect-[2/3] overflow-hidden rounded-2xl bg-slate-900"
                                >
                                    {item.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                            alt={name}
                                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <span className="grid size-full place-items-center text-slate-700">
                                            <Film className="size-10" />
                                        </span>
                                    )}
                                </Link>
                                <div className="mt-3 flex items-start gap-2">
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={href}
                                            className="block truncate text-sm font-bold hover:text-sky-300"
                                        >
                                            {name}
                                        </Link>
                                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                            <span>
                                                {date.slice(0, 4) || '—'}
                                            </span>
                                            <span className="flex items-center gap-1 text-amber-400">
                                                <Star className="size-3 fill-current" />
                                                {Number(
                                                    item.vote_average ?? 0,
                                                ).toLocaleString(localeTag, {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 1,
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                    <ConfirmActionForm
                                        confirmation={{
                                            title: t('Remove from Watchlist'),
                                            description: t(
                                                'Remove “:title” from the watchlist?',
                                                { title: name },
                                            ),
                                            label: t('Remove'),
                                        }}
                                        action={destroy({
                                            mediaType: type,
                                            mediaId: item.id,
                                        })}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <button
                                                disabled={processing}
                                                aria-label={t('Remove :title', {
                                                    title: name,
                                                })}
                                                className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-50"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    </ConfirmActionForm>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default function AdminWatchlist({
    movies,
    series,
}: {
    movies: Page | null;
    series: Page | null;
}) {
    const { t } = useTranslation();
    return (
        <AdminLayout active="watchlist">
            <SeoHead title={t('Admin watchlist')} />
            {movies && series ? (
                <div className="space-y-14">
                    <Collection
                        title={t('Movies')}
                        type="movie"
                        page={movies}
                    />
                    <Collection title={t('TV shows')} type="tv" page={series} />
                </div>
            ) : (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-8 text-center text-amber-100">
                    <h2 className="text-xl font-black">
                        {t('The TMDB Watchlist is unavailable')}{' '}
                    </h2>
                    <p className="mt-2 text-sm text-amber-100/70">
                        {t(
                            'Check the account token and permissions, or reconnect your TMDB account.',
                        )}{' '}
                    </p>
                    <a
                        href={connectTmdb.url()}
                        className="mt-5 inline-flex rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-black text-white transition hover:bg-sky-400"
                    >
                        {t('Connect TMDB')}{' '}
                    </a>
                </div>
            )}
        </AdminLayout>
    );
}
