import { ConfirmActionButton } from '@/components/confirm-action';
import { Link } from '@inertiajs/react';
import {
    CalendarClock,
    Clock3,
    Film,
    LoaderCircle,
    Play,
    Trash2,
    Tv,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { posterImage } from '@/lib/tmdb-images';
import { CatalogHeader } from '@/components/catalog-header';
import { SeoHead } from '@/components/seo-head';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';
import { watchHistory, type WatchHistoryEntry } from '@/lib/watch-history';
import {
    continueHistoryRoute,
    lastHistoryEpisode,
} from '@/lib/watch-history-navigation';

const pageSize = 12;

const updatedLabel = (timestamp: number, localeTag: string) =>
    new Intl.DateTimeFormat(localeTag, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(timestamp));

function HistorySkeleton() {
    return (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
                <div
                    key={index}
                    className="flex animate-pulse gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-4"
                >
                    <div className="h-36 w-24 shrink-0 rounded-xl bg-white/7" />
                    <div className="flex-1 py-2">
                        <div className="h-4 w-4/5 rounded bg-white/7" />
                        <div className="mt-3 h-3 w-1/2 rounded bg-white/5" />
                        <div className="mt-8 h-9 rounded-xl bg-white/7" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function History() {
    const { t, localeTag } = useTranslation();
    const [items, setItems] = useState<WatchHistoryEntry[]>([]);
    const [visibleItems, setVisibleItems] = useState(pageSize);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isActive = true;

        const loadHistory = async () => {
            try {
                const storedItems = await watchHistory.all();

                if (isActive) {
                    setItems(storedItems);
                    setHasError(false);
                }
            } catch {
                if (isActive) {
                    setItems([]);
                    setHasError(true);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void loadHistory();
        const unsubscribe = watchHistory.subscribe(() => {
            void loadHistory();
        });

        return () => {
            isActive = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const target = loadMoreRef.current;

        if (target === null || visibleItems >= items.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisibleItems((current) => current + pageSize);
                }
            },
            { rootMargin: '500px' },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [items.length, visibleItems]);

    const remove = (item: WatchHistoryEntry) => {
        return watchHistory.remove(item);
    };

    const clear = () => {
        return watchHistory.clear();
    };

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={t('History — Beta Movies')} />
            <CatalogNavigation active="istoric" />
            <CatalogHeader />

            <main className="pb-28 lg:ml-64 lg:pb-10">
                <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-black tracking-[.28em] text-sky-400">
                                BETA MOVIES
                            </p>
                            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                                {t('History')}
                            </h1>
                            <p className="mt-3 text-slate-400">
                                {t(
                                    'Continue movies and TV shows where you left off.',
                                )}
                            </p>
                        </div>
                        {!isLoading && items.length > 0 && (
                            <ConfirmActionButton
                                confirmation={{
                                    title: t('Clear history?'),
                                    description: t(
                                        'Your entire watch history on this device will be permanently deleted.',
                                    ),
                                    label: t('Clear history'),
                                }}
                                onConfirm={clear}
                            >
                                <button
                                    type="button"

                                    className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl border border-rose-400/25 px-4 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-400/10 sm:self-auto"
                                >
                                    <Trash2 className="size-4" />{' '}
                                    {t('Clear history')}
                                </button>
                            </ConfirmActionButton>
                        )}
                    </section>

                    {isLoading ? (
                        <HistorySkeleton />
                    ) : hasError ? (
                        <section className="mt-10 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-center text-amber-100">
                            {t('History is unavailable in this browser.')}
                        </section>
                    ) : items.length === 0 ? (
                        <section className="mt-10 grid min-h-80 place-items-center rounded-3xl border border-white/8 bg-white/[.025] p-8 text-center">
                            <div>
                                <Clock3 className="mx-auto size-11 text-slate-700" />
                                <h2 className="mt-4 text-xl font-black">
                                    {t('Your history is empty')}
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    {t(
                                        'Play a movie or episode and it will appear here.',
                                    )}
                                </p>
                            </div>
                        </section>
                    ) : (
                        <>
                            <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {items.slice(0, visibleItems).map((item) => {
                                    const episode = lastHistoryEpisode(item);

                                    return (
                                        <article
                                            key={item.showId}
                                            className="group flex min-w-0 gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-4 transition hover:border-white/15 hover:bg-white/[.045]"
                                        >
                                            <Link
                                                href={continueHistoryRoute(
                                                    item,
                                                )}
                                                prefetch
                                                className="h-36 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900"
                                            >
                                                {item.posterPath ? (
                                                    <img
                                                        {...posterImage(
                                                            item.posterPath,
                                                            '96px',
                                                        )}
                                                        alt={item.title}
                                                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <span className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-950">
                                                        {item.type ===
                                                        'movie' ? (
                                                            <Film className="size-9 text-slate-600" />
                                                        ) : (
                                                            <Tv className="size-9 text-slate-600" />
                                                        )}
                                                    </span>
                                                )}
                                            </Link>
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={continueHistoryRoute(
                                                                item,
                                                            )}
                                                            className="block truncate text-base font-black text-white hover:text-sky-300"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                                                            <CalendarClock className="size-3" />
                                                            {updatedLabel(
                                                                item.updatedAt,
                                                                localeTag,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <ConfirmActionButton
                                                        confirmation={{
                                                            title: t(
                                                                'Remove from history?',
                                                            ),
                                                            description: t(
                                                                'Remove “:title” and its watch progress from this device?',
                                                                {
                                                                    title: item.title,
                                                                },
                                                            ),
                                                            label: t('Remove'),
                                                        }}
                                                        onConfirm={() =>
                                                            remove(item)
                                                        }
                                                    >
                                                        <button
                                                            type="button"

                                                            className="cursor-pointer rounded-lg p-1.5 text-slate-600 transition hover:bg-rose-400/10 hover:text-rose-300"
                                                            aria-label={t(
                                                                'Remove :title from history',
                                                                {
                                                                    title: item.title,
                                                                },
                                                            )}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </ConfirmActionButton>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black tracking-wide uppercase">
                                                    <span className="rounded-md bg-white/6 px-2 py-1 text-slate-400">
                                                        {item.type === 'movie'
                                                            ? t('Movie')
                                                            : t('TV Show')}
                                                    </span>
                                                    {episode && (
                                                        <span className="rounded-md bg-sky-400/10 px-2 py-1 text-sky-300">
                                                            {t(
                                                                'S:season · E:episode',
                                                                {
                                                                    season: episode.season,
                                                                    episode:
                                                                        episode.episode,
                                                                },
                                                            )}
                                                        </span>
                                                    )}
                                                    {item.type === 'tv' && (
                                                        <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-300">
                                                            {t(
                                                                ':count watched',
                                                                {
                                                                    count: item.watchedEpisodes.length.toLocaleString(
                                                                        localeTag,
                                                                    ),
                                                                },
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <Link
                                                    href={continueHistoryRoute(
                                                        item,
                                                    )}
                                                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-black text-white transition hover:bg-sky-400"
                                                >
                                                    <Play className="size-3.5 fill-current" />
                                                    {episode
                                                        ? t(
                                                              'Continue S:season E:episode',
                                                              {
                                                                  season: episode.season,
                                                                  episode:
                                                                      episode.episode,
                                                              },
                                                          )
                                                        : t('Watch')}
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </section>

                            {visibleItems < items.length && (
                                <div
                                    ref={loadMoreRef}
                                    className="flex h-20 items-center justify-center gap-2 text-sm font-bold text-slate-500"
                                >
                                    <LoaderCircle className="size-4 animate-spin" />
                                    {t('Loading...')}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
