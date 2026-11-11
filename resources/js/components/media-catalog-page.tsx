import { InfiniteScroll, Link } from '@inertiajs/react';
import { Film, Star } from 'lucide-react';
import { CatalogHeader } from '@/components/catalog-header';
import { CatalogSkeletonGrid } from '@/components/catalog-skeleton-grid';
import { SeoHead } from '@/components/seo-head';
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll';
import { useTranslation } from '@/hooks/use-translation';
import { catalogPosterSizes, posterImage } from '@/lib/tmdb-images';
import {
    CatalogFooter,
    CatalogNavigation,
    type CatalogPage,
} from '@/components/catalog-navigation';

export type CatalogItem = {
    id: number;
    title: string;
    year: number | null;
    score: string;
    genre: string;
    poster: string | null;
    description: string;
};
type CatalogList = {
    value: string;
    label: string;
    supportsGenres: boolean;
};
export type MediaCatalogProps = {
    catalog: {
        items: CatalogItem[];
        page: number;
        totalPages: number;
        totalResults: number;
    };
    filters: { genre: string | null; q: string | null; list: string };
    lists: CatalogList[];
    genres: Array<{ id: number; name: string }>;
    tmdbAvailable: boolean;
};
type Props = MediaCatalogProps & {
    active: CatalogPage;
    title: string;
    description: string;
    popularTitle: string;
    emptyText: string;
    route: (query: {
        genre?: number;
        q?: string;
        list?: string;
        page?: number;
    }) => {
        url: string;
        method: 'get';
    };
    showRoute: (id: number) => { url: string; method: 'get' };
};

export function MediaCatalogPage({
    catalog,
    filters,
    lists,
    genres,
    tmdbAvailable,
    active,
    title,
    description,
    popularTitle,
    emptyText,
    route,
    showRoute,
}: Props) {
    const { t, localeTag } = useTranslation();
    const selectedList = lists.find((list) => list.value === filters.list);
    const showGenres = selectedList?.supportsGenres && !filters.q;
    const listRail = useHorizontalScroll(lists.length > 0);
    const genreRail = useHorizontalScroll(Boolean(showGenres));
    const catalogHeading =
        filters.list === 'popular'
            ? popularTitle
            : (selectedList?.label ?? popularTitle);
    const catalogKey = JSON.stringify([
        filters.list,
        filters.genre,
        filters.q,
        localeTag,
    ]);
    const pageRoute = (page: number) =>
        route({
            list: filters.list,
            genre: filters.genre ? Number(filters.genre) : undefined,
            q: filters.q ?? undefined,
            page,
        });

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={`${t(title)} — Beta Movies`} />
            <CatalogNavigation active={active} />
            <CatalogHeader />
            <main className="pb-28 lg:ml-64 lg:pb-10">
                <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <section className="space-y-3">
                        <p className="text-[11px] font-black tracking-[.28em] text-sky-400">
                            BETA MOVIES
                        </p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            {t(title)}
                        </h1>
                        <p className="text-slate-400">{t(description)}</p>
                    </section>
                    <nav aria-label={t('Browse lists')}>
                        <div
                            ref={listRail}
                            className="flex cursor-grab [scrollbar-width:none] gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
                        >
                            {lists.map((list) => (
                                <Link
                                    key={list.value}
                                    href={route({
                                        list: list.value,
                                        genre:
                                            list.supportsGenres && filters.genre
                                                ? Number(filters.genre)
                                                : undefined,
                                    })}
                                    prefetch={['hover', 'click']}
                                    cacheFor="1m"
                                    aria-current={
                                        !filters.q &&
                                        filters.list === list.value
                                            ? 'page'
                                            : undefined
                                    }
                                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${!filters.q && filters.list === list.value ? 'border-sky-400 bg-sky-500 text-white' : 'border-white/10 bg-white/[.03] text-slate-400 hover:border-white/20 hover:text-white'}`}
                                >
                                    {t(list.label)}
                                </Link>
                            ))}
                        </div>
                    </nav>
                    {showGenres && (
                        <div
                            ref={genreRail}
                            className="flex cursor-grab [scrollbar-width:none] gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
                        >
                            <Link
                                href={route({ list: filters.list })}
                                prefetch={['hover', 'click']}
                                cacheFor="1m"
                                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${!filters.genre ? 'border-sky-400 bg-sky-500 text-white' : 'border-white/10 bg-white/[.03] text-slate-400 hover:border-white/20 hover:text-white'}`}
                            >
                                {t('All genres')}
                            </Link>
                            {genres.map((genre) => (
                                <Link
                                    key={genre.id}
                                    href={route({
                                        list: filters.list,
                                        genre: genre.id,
                                    })}
                                    prefetch={['hover', 'click']}
                                    cacheFor="1m"
                                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${filters.genre === String(genre.id) ? 'border-sky-400 bg-sky-500 text-white' : 'border-white/10 bg-white/[.03] text-slate-400 hover:border-white/20 hover:text-white'}`}
                                >
                                    {genre.name}
                                </Link>
                            ))}
                        </div>
                    )}
                    {!tmdbAvailable ? (
                        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-center text-amber-100">
                            {t(
                                'The catalog is currently unavailable. Please try again in a few moments.',
                            )}
                        </div>
                    ) : catalog.items.length === 0 ? (
                        <div className="rounded-3xl border border-white/8 bg-white/[.03] p-12 text-center text-slate-400">
                            {t(emptyText)}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-xl font-black">
                                    {filters.q
                                        ? t('Results for “:query”', {
                                              query: filters.q,
                                          })
                                        : t(catalogHeading)}
                                </h2>
                                <span className="text-xs text-slate-500">
                                    {t(':count results', {
                                        count: catalog.totalResults.toLocaleString(
                                            localeTag,
                                        ),
                                    })}
                                </span>
                            </div>
                            <InfiniteScroll
                                key={catalogKey}
                                data="catalog"
                                buffer={500}
                                onlyNext
                                preserveUrl={false}
                                loading={
                                    <CatalogSkeletonGrid title={t(title)} />
                                }
                                as="section"
                                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                            >
                                {catalog.items.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={showRoute(item.id)}
                                        prefetch
                                        className="group min-w-0"
                                    >
                                        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
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
                                                <div className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                                                    <Film className="size-12" />
                                                </div>
                                            )}
                                            <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-1 text-xs font-black text-amber-400 backdrop-blur">
                                                <Star className="size-3 fill-current" />{' '}
                                                {Number(
                                                    item.score,
                                                ).toLocaleString(localeTag, {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 1,
                                                })}
                                            </span>
                                        </div>
                                        <h2 className="mt-3 truncate text-sm font-bold text-white">
                                            {item.title}
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {item.year ?? '—'} · {item.genre}
                                        </p>
                                    </Link>
                                ))}
                            </InfiniteScroll>
                            {catalog.totalPages > 1 && (
                                <nav
                                    aria-label={t('Pagination')}
                                    className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5"
                                >
                                    <span className="text-xs text-slate-500">
                                        {t('Page :page of :pages', {
                                            page: catalog.page.toLocaleString(
                                                localeTag,
                                            ),
                                            pages: catalog.totalPages.toLocaleString(
                                                localeTag,
                                            ),
                                        })}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {catalog.page > 1 && (
                                            <Link
                                                href={pageRoute(
                                                    catalog.page - 1,
                                                )}
                                                rel="prev"
                                                prefetch={['hover', 'click']}
                                                cacheFor="1m"
                                                className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/[.03] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                                            >
                                                {t('Previous page')}
                                            </Link>
                                        )}
                                        {catalog.page < catalog.totalPages && (
                                            <Link
                                                href={pageRoute(
                                                    catalog.page + 1,
                                                )}
                                                rel="next"
                                                prefetch={['hover', 'click']}
                                                cacheFor="1m"
                                                className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/[.03] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                                            >
                                                {t('Next page')}
                                            </Link>
                                        )}
                                    </div>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
