import { Link } from '@inertiajs/react';
import { CircleCheck, Film, Play, Star, Tv } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CatalogHeader } from '@/components/catalog-header';
import { ContinueWatchingSection } from '@/components/continue-watching-section';
import { HomeMediaRail } from '@/components/home-media-rail';
import { SeoHead } from '@/components/seo-head';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';
import { watchHistory } from '@/lib/watch-history';
import { posterImage, railPosterSizes } from '@/lib/tmdb-images';
import { useTranslation } from '@/hooks/use-translation';
import { index as moviesIndex, show as movieShow } from '@/routes/movies';
import {
    index as seriesIndex,
    show as seriesShow,
    watch as seriesWatch,
} from '@/routes/series';

type MediaItem = {
    id: number;
    title: string;
    year: number | null;
    score: string;
    genre: string;
    type: 'film' | 'serial';
    runtime: string;
    poster: string | null;
    backdrop?: string | null;
    description: string;
};

type WelcomeProps = {
    popularMovies: MediaItem[];
    nowPlayingMovies: MediaItem[];
    trendingSeries: MediaItem[];
    recentEpisodes: RecentEpisode[];
    tmdbAvailable: boolean;
};

type RecentEpisode = {
    id: number;
    name: string;
    poster_path: string | null;
    season: number;
    episode: number;
    title: string;
    overview: string;
    air_date: string;
};

const detailsRoute = (item: MediaItem) =>
    item.type === 'film' ? movieShow(item.id) : seriesShow(item.id);

const slugify = (value: string) =>
    value
        .toLocaleLowerCase('en-US')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'title';

const episodeKey = (episode: RecentEpisode) =>
    `${episode.id}-${episode.season}-${episode.episode}`;

const airDateLabel = (
    airDate: string,
    localeTag: string,
    t: ReturnType<typeof useTranslation>['t'],
) => {
    const date = new Date(`${airDate}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
        return airDate;
    }

    const today = new Date();
    const todayUtc = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
    );
    const elapsedDays = Math.round((todayUtc - date.getTime()) / 86_400_000);

    if (elapsedDays === 0) {
        return t('Today');
    }

    if (elapsedDays === 1) {
        return t('Yesterday');
    }

    if (elapsedDays > 1 && elapsedDays < 8) {
        return t(':count days ago', { count: elapsedDays });
    }

    return new Intl.DateTimeFormat(localeTag, {
        dateStyle: 'medium',
        timeZone: 'UTC',
    }).format(date);
};

function RecentEpisodesSection({ episodes }: { episodes: RecentEpisode[] }) {
    const { t, localeTag } = useTranslation();
    const [watched, setWatched] = useState<Set<string>>(new Set());

    useEffect(() => {
        let isActive = true;

        const loadWatchedEpisodes = async () => {
            const entries = await Promise.all(
                [...new Set(episodes.map((episode) => episode.id))].map((id) =>
                    watchHistory.get('tv', id),
                ),
            );

            if (!isActive) {
                return;
            }

            const watchedEpisodes = new Set<string>();

            entries.forEach((entry) => {
                entry?.watchedEpisodes.forEach((key) => {
                    watchedEpisodes.add(`${entry.mediaId}-${key}`);
                });
            });

            setWatched(watchedEpisodes);
        };

        void loadWatchedEpisodes().catch(() => setWatched(new Set()));
        const unsubscribe = watchHistory.subscribe(() => {
            void loadWatchedEpisodes().catch(() => setWatched(new Set()));
        });

        return () => {
            isActive = false;
            unsubscribe();
        };
    }, [episodes]);

    if (episodes.length === 0) {
        return null;
    }

    return (
        <HomeMediaRail
            title="New Episodes"
            subtitle="Recently aired episodes from your watchlist"
        >
            {episodes.map((episode) => {
                const isWatched = watched.has(episodeKey(episode));
                const href = seriesWatch({
                    series: episode.id,
                    name: slugify(episode.name),
                    season: episode.season,
                    episode: episode.episode,
                });

                return (
                    <Link
                        key={episodeKey(episode)}
                        href={href}
                        prefetch
                        className="group min-w-0 snap-start"
                        title={t(':title — Season :season, Episode :episode', {
                            title: episode.name,
                            season: episode.season,
                            episode: episode.episode,
                        })}
                    >
                        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/8 bg-slate-900 shadow-[0_18px_50px_rgba(0,0,0,.22)] transition duration-300 group-hover:-translate-y-1 group-hover:border-sky-400/30">
                            {episode.poster_path ? (
                                <img
                                    {...posterImage(
                                        episode.poster_path,
                                        railPosterSizes,
                                    )}
                                    alt={episode.name}
                                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <span className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-950">
                                    <Tv className="size-12 text-slate-600" />
                                </span>
                            )}
                            <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                            <span className="absolute top-3 left-3 rounded-lg bg-slate-950/85 px-2.5 py-1.5 text-[10px] font-black tracking-wide text-white backdrop-blur">
                                S{episode.season} · E{episode.episode}
                            </span>
                            {isWatched && (
                                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-1.5 text-[10px] font-black text-white shadow-lg">
                                    <CircleCheck className="size-3" />{' '}
                                    {t('Watched')}
                                </span>
                            )}
                            <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                                <span className="grid size-12 place-items-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-950/40">
                                    <Play className="ml-0.5 size-5 fill-current" />
                                </span>
                            </span>
                        </div>
                        <h3 className="mt-3 truncate text-sm font-bold text-white sm:text-[15px]">
                            {episode.name}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-400">
                            {episode.title ||
                                t('Episode :episode', {
                                    episode: episode.episode,
                                })}{' '}
                            · {airDateLabel(episode.air_date, localeTag, t)}
                        </p>
                    </Link>
                );
            })}
        </HomeMediaRail>
    );
}

function MediaCard({ item }: { item: MediaItem }) {
    const { t, localeTag } = useTranslation();

    return (
        <Link
            href={detailsRoute(item)}
            prefetch
            className="group block min-w-0"
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/8 bg-slate-900 shadow-[0_18px_50px_rgba(0,0,0,.22)] transition duration-300 group-hover:-translate-y-1 group-hover:border-sky-400/30 group-hover:shadow-[0_22px_55px_rgba(37,99,235,.2)]">
                {item.poster ? (
                    <img
                        {...posterImage(item.poster, railPosterSizes)}
                        alt={item.title}
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <span className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                        <Film className="size-12" />
                    </span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
                <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="grid size-12 place-items-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-950/40">
                        <Play className="ml-0.5 size-5 fill-current" />
                    </span>
                </span>
                <span className="absolute right-3 bottom-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-black tracking-wide text-white backdrop-blur">
                    {t(item.type === 'film' ? 'MOVIE' : 'TV SHOW')}
                </span>
            </div>
            <h3 className="mt-3 truncate text-sm font-bold text-white sm:text-[15px]">
                {item.title}
            </h3>
            <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-400">
                <span className="truncate">
                    {item.year ?? '—'} · {item.genre}
                </span>
                <span className="flex shrink-0 items-center gap-1 font-bold text-amber-400">
                    <Star className="size-3 fill-current" />{' '}
                    {Number(item.score).toLocaleString(localeTag, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                    })}
                </span>
            </div>
        </Link>
    );
}

function MediaSection({
    title,
    subtitle,
    items,
    href,
}: {
    title: string;
    subtitle: string;
    items: MediaItem[];
    href: ReturnType<typeof moviesIndex>;
}) {
    if (items.length === 0) {
        return null;
    }

    return (
        <HomeMediaRail title={title} subtitle={subtitle} href={href}>
            {items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="snap-start">
                    <MediaCard item={item} />
                </div>
            ))}
        </HomeMediaRail>
    );
}

export default function Welcome({
    popularMovies,
    nowPlayingMovies,
    trendingSeries,
    recentEpisodes,
    tmdbAvailable,
}: WelcomeProps) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100 selection:bg-sky-400/30">
            <SeoHead title={t('Beta Movies — Movies and TV Shows')} />
            <CatalogNavigation active="acasa" />
            <CatalogHeader />

            <main className="pb-28 lg:ml-64 lg:pb-12">
                <div className="mx-auto max-w-[1500px] space-y-14 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
                    {!tmdbAvailable && (
                        <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-center">
                            <Film className="mx-auto size-10 text-amber-300" />
                            <h1 className="mt-4 text-2xl font-black">
                                {t('The catalog could not be loaded')}
                            </h1>
                            <p className="mt-2 text-sm text-amber-100/75">
                                {t('Please try again in a few moments.')}
                            </p>
                        </section>
                    )}
                    <ContinueWatchingSection />
                    <RecentEpisodesSection episodes={recentEpisodes} />
                    <MediaSection
                        title="Now Playing"
                        subtitle="Movies currently in theaters"
                        items={nowPlayingMovies}
                        href={moviesIndex()}
                    />
                    <MediaSection
                        title="Popular Movies"
                        subtitle="The most watched titles right now"
                        items={popularMovies}
                        href={moviesIndex()}
                    />
                    <MediaSection
                        title="Trending TV Shows"
                        subtitle="The shows everyone is talking about"
                        items={trendingSeries}
                        href={seriesIndex()}
                    />
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
