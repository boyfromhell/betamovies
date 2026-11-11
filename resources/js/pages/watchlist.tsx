import { InfiniteScroll, Link } from '@inertiajs/react';
import { Bookmark, Film, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { catalogPosterSizes, posterImage } from '@/lib/tmdb-images';
import { CatalogHeader } from '@/components/catalog-header';
import { CatalogSkeletonGrid } from '@/components/catalog-skeleton-grid';
import { SeoHead } from '@/components/seo-head';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';
import { show as movieShow } from '@/routes/movies';
import { show as seriesShow } from '@/routes/series';
import type { WatchlistItem } from '@/types/watchlist';

const detailsRoute = (item: WatchlistItem) =>
    item.type === 'film' ? movieShow(item.id) : seriesShow(item.id);

type Props = {
    catalog: {
        items: WatchlistItem[];
        page: number;
        totalPages: number;
        totalResults: number;
    };
    tmdbAvailable: boolean;
};

export default function Watchlist({ catalog, tmdbAvailable }: Props) {
    const { t, localeTag } = useTranslation();
    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={t('Watchlist — Beta Movies')} />
            <CatalogNavigation active="watchlist" />
            <CatalogHeader />

            <main className="pb-28 lg:ml-64 lg:pb-10">
                <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <section>
                        <p className="text-[11px] font-black tracking-[.28em] text-sky-400">
                            BETA MOVIES
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                            {t('Watchlist')}
                        </h1>
                        <p className="mt-3 text-slate-400">
                            {t(
                                'Movies and TV shows saved to your TMDB account.',
                            )}
                        </p>
                    </section>

                    {!tmdbAvailable ? (
                        <section className="mt-10 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-center text-amber-100">
                            {t('Your TMDB Watchlist is currently unavailable.')}
                        </section>
                    ) : catalog.items.length === 0 ? (
                        <section className="mt-10 grid min-h-80 place-items-center rounded-3xl border border-white/8 bg-white/[.025] p-8 text-center">
                            <div>
                                <Bookmark className="mx-auto size-11 text-slate-700" />
                                <h2 className="mt-4 text-xl font-black">
                                    {t('Your Watchlist is empty')}
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    {t(
                                        'Add a movie or TV show from its details page.',
                                    )}
                                </p>
                            </div>
                        </section>
                    ) : (
                        <InfiniteScroll
                            data="catalog"
                            buffer={500}
                            onlyNext
                            preserveUrl={false}
                            loading={
                                <CatalogSkeletonGrid title={t('Watchlist')} />
                            }
                            as="section"
                            className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                        >
                            {catalog.items.map((item) => (
                                <article
                                    key={`${item.type}-${item.id}`}
                                    className="group min-w-0"
                                >
                                    <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
                                        <Link
                                            href={detailsRoute(item)}
                                            prefetch
                                            className="block size-full"
                                        >
                                            {item.poster ? (
                                                <img
                                                    {...posterImage(
                                                        item.poster,
                                                        catalogPosterSizes,
                                                    )}
                                                    alt={item.title}
                                                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                                                    <Film className="size-12" />
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                    <Link
                                        href={detailsRoute(item)}
                                        className="mt-3 block truncate text-sm font-bold text-white hover:text-sky-300"
                                    >
                                        {item.title}
                                    </Link>
                                    <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-500">
                                        <span className="truncate">
                                            {item.year ?? '—'} · {item.genre}
                                        </span>
                                        <span className="flex shrink-0 items-center gap-1 font-bold text-amber-400">
                                            <Star className="size-3 fill-current" />{' '}
                                            {Number(item.score).toLocaleString(
                                                localeTag,
                                                {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 1,
                                                },
                                            )}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
