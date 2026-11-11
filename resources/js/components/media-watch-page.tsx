import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    Clock3,
    Film,
    Play,
    Server,
    Star,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CatalogHeader } from '@/components/catalog-header';
import { SeoHead } from '@/components/seo-head';
import {
    CatalogFooter,
    CatalogNavigation,
    type CatalogPage,
} from '@/components/catalog-navigation';
import { WatchInstructions } from '@/components/watch-instructions';
import { WatchlistButton } from '@/components/watchlist-button';
import { watchHistory } from '@/lib/watch-history';
import { useTranslation } from '@/hooks/use-translation';
import {
    backdropImage,
    contentImageSizes,
    originalImage,
    posterImage,
    stillImage,
} from '@/lib/tmdb-images';

type Genre = { id: number; name: string };
type Season = {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    air_date?: string | null;
};
type Episode = {
    id: number;
    name: string;
    overview?: string;
    episode_number: number;
    air_date?: string | null;
    runtime?: number | null;
    still_path?: string | null;
};
type Media = {
    id: number;
    title?: string;
    name?: string;
    overview?: string;
    tagline?: string;
    backdrop_path?: string | null;
    poster_path?: string | null;
    release_date?: string;
    first_air_date?: string;
    runtime?: number | null;
    vote_average?: number;
    genres?: Genre[];
};
type PlayerSource = {
    id: string;
    name: string;
    quality: string;
    url: string;
    default: boolean;
};
type RouteTarget = { url: string; method: 'get' };
type EpisodeTarget = {
    route: RouteTarget;
    season: number;
    episode: number;
};

export type MediaWatchPageProps = {
    media: Media;
    slug: string;
    players: PlayerSource[];
    seasons?: Season[];
    episodes?: Episode[];
    selectedSeason?: number | null;
    selectedEpisode?: number | null;
};

type Props = MediaWatchPageProps & {
    mediaType: 'movie' | 'tv';
    active: CatalogPage;
    catalogRoute: RouteTarget;
    detailsRoute: RouteTarget;
    episodeRoute?: (season: number, episode: number) => RouteTarget;
};

const watchedThresholdMs = 10 * 60 * 1000;
const minimumPlayerHeight = 160;

const formatAirDate = (value: string | null | undefined, localeTag: string) => {
    if (!value) {
        return null;
    }

    const date = new Date(`${value}T00:00:00Z`);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(localeTag, {
              dateStyle: 'medium',
              timeZone: 'UTC',
          }).format(date);
};

function EpisodeNavigationButton({
    target,
    direction,
}: {
    target: EpisodeTarget | null;
    direction: 'previous' | 'next';
}) {
    const { t } = useTranslation();
    const isPrevious = direction === 'previous';
    const label = t(isPrevious ? 'Previous episode' : 'Next episode');
    const content = (
        <>
            {isPrevious && <ChevronLeft className="size-4" />}
            <span>
                <span className="block text-[10px] font-black tracking-wide uppercase opacity-60">
                    {label}
                </span>
                {target && (
                    <span className="block text-xs font-black">
                        S{target.season} · E{target.episode}
                    </span>
                )}
            </span>
            {!isPrevious && <ChevronRight className="size-4" />}
        </>
    );
    const className = `inline-flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-slate-200 transition sm:px-4 ${
        target
            ? 'border-white/10 bg-white/5 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white'
            : 'cursor-not-allowed border-white/5 bg-white/[.02] text-slate-700'
    }`;

    return target ? (
        <Link href={target.route} prefetch className={className}>
            {content}
        </Link>
    ) : (
        <span className={className} aria-disabled="true">
            {content}
        </span>
    );
}

export function MediaWatchPage({
    media,
    slug,
    mediaType,
    active,
    catalogRoute,
    detailsRoute,
    players,
    seasons = [],
    episodes = [],
    selectedSeason = null,
    selectedEpisode = null,
    episodeRoute,
}: Props) {
    const { t, localeTag } = useTranslation();
    const defaultPlayer =
        players.find((player) => player.default) ?? players[0] ?? null;
    const [selectedPlayerId, setSelectedPlayerId] = useState(
        defaultPlayer?.id ?? '',
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
    const playerFrameRef = useRef<HTMLDivElement>(null);
    const playerControlsRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [playerMaxHeight, setPlayerMaxHeight] = useState<number>();
    const selectedPlayer =
        players.find((player) => player.id === selectedPlayerId) ??
        defaultPlayer;
    const currentEpisode = useMemo(
        () =>
            episodes.find(
                (episode) => episode.episode_number === selectedEpisode,
            ) ?? null,
        [episodes, selectedEpisode],
    );
    const title = media.title ?? media.name ?? t('Title unavailable');
    const releaseDate = media.release_date ?? media.first_air_date;
    const backdropPath = currentEpisode?.still_path || media.backdrop_path;
    const isEpisodeStill = Boolean(currentEpisode?.still_path);
    const backdrop = isEpisodeStill
        ? stillImage(backdropPath, contentImageSizes)
        : backdropImage(backdropPath, contentImageSizes);

    useEffect(() => {
        const frame = playerFrameRef.current;
        const controls = playerControlsRef.current;

        if (frame === null || controls === null) {
            return;
        }

        const header = document.querySelector('header');
        const mobileNavigation = document.querySelector<HTMLElement>(
            '[data-mobile-navigation]',
        );
        const updatePlayerSize = () => {
            const viewportHeight =
                window.visualViewport?.height ?? window.innerHeight;
            const playerTop =
                frame.getBoundingClientRect().top + window.scrollY;
            const navigationHeight = mobileNavigation?.offsetHeight ?? 0;
            const availableHeight = Math.max(
                0,
                viewportHeight - playerTop - navigationHeight - 16,
            );
            const controlsHeight = controls.offsetHeight;
            const reservedControls =
                availableHeight >= controlsHeight + minimumPlayerHeight
                    ? controlsHeight
                    : 0;

            setPlayerMaxHeight(
                Math.min(
                    availableHeight,
                    availableHeight - reservedControls + 140,
                ),
            );
        };
        const observer =
            typeof ResizeObserver === 'undefined'
                ? null
                : new ResizeObserver(updatePlayerSize);

        [controls, header, mobileNavigation, toolbarRef.current].forEach(
            (element) => {
                if (element !== null) {
                    observer?.observe(element);
                }
            },
        );
        updatePlayerSize();
        window.addEventListener('resize', updatePlayerSize);
        window.visualViewport?.addEventListener('resize', updatePlayerSize);

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', updatePlayerSize);
            window.visualViewport?.removeEventListener(
                'resize',
                updatePlayerSize,
            );
        };
    }, []);

    useEffect(() => {
        setSelectedPlayerId(defaultPlayer?.id ?? '');
        setIsPlaying(false);
    }, [defaultPlayer?.id, selectedSeason, selectedEpisode]);

    useEffect(() => {
        let isActive = true;

        const syncHistory = async () => {
            try {
                const entry = await watchHistory.get(mediaType, media.id);

                if (isActive) {
                    setWatchedEpisodes(entry?.watchedEpisodes ?? []);
                }
            } catch {
                if (isActive) {
                    setWatchedEpisodes([]);
                }
            }
        };

        void syncHistory();
        const unsubscribe = watchHistory.subscribe(() => {
            void syncHistory();
        });

        return () => {
            isActive = false;
            unsubscribe();
        };
    }, [media.id, mediaType]);

    useEffect(() => {
        if (
            mediaType !== 'tv' ||
            !isPlaying ||
            selectedSeason === null ||
            selectedEpisode === null ||
            watchedEpisodes.includes(`${selectedSeason}-${selectedEpisode}`)
        ) {
            return;
        }

        let elapsedMs = 0;
        let lastTickAt = Date.now();
        const intervalId = window.setInterval(() => {
            const currentTickAt = Date.now();

            if (document.visibilityState === 'visible') {
                elapsedMs += currentTickAt - lastTickAt;
            }

            lastTickAt = currentTickAt;

            if (elapsedMs < watchedThresholdMs) {
                return;
            }

            window.clearInterval(intervalId);
            void watchHistory
                .markWatched({
                    mediaId: media.id,
                    type: mediaType,
                    title,
                    slug,
                    posterPath: media.poster_path ?? null,
                    season: selectedSeason,
                    episode: selectedEpisode,
                })
                .catch(() => undefined);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [
        isPlaying,
        media.id,
        media.poster_path,
        mediaType,
        selectedEpisode,
        selectedSeason,
        slug,
        title,
        watchedEpisodes,
    ]);

    const startPlaying = () => {
        setIsPlaying(true);
        void watchHistory
            .record({
                mediaId: media.id,
                type: mediaType,
                title,
                slug,
                posterPath: media.poster_path ?? null,
                season: selectedSeason,
                episode: selectedEpisode,
            })
            .catch(() => undefined);
    };

    const selectSeason = (seasonNumber: number) => {
        if (episodeRoute) {
            router.visit(episodeRoute(seasonNumber, 1).url);
        }
    };

    const episodeTargets = (() => {
        if (
            !episodeRoute ||
            selectedSeason === null ||
            selectedEpisode === null
        ) {
            return { previous: null, next: null };
        }

        const orderedEpisodes = [...episodes].sort(
            (first, second) => first.episode_number - second.episode_number,
        );
        const currentEpisodeIndex = orderedEpisodes.findIndex(
            (episode) => episode.episode_number === selectedEpisode,
        );
        const orderedSeasons = seasons
            .filter((season) => season.season_number > 0)
            .sort(
                (first, second) => first.season_number - second.season_number,
            );
        const currentSeasonIndex = orderedSeasons.findIndex(
            (season) => season.season_number === selectedSeason,
        );
        const previousEpisode = orderedEpisodes[currentEpisodeIndex - 1];
        const nextEpisode = orderedEpisodes[currentEpisodeIndex + 1];
        const previousSeason = orderedSeasons[currentSeasonIndex - 1];
        const nextSeason = orderedSeasons[currentSeasonIndex + 1];
        const previous = previousEpisode
            ? {
                  route: episodeRoute(
                      selectedSeason,
                      previousEpisode.episode_number,
                  ),
                  season: selectedSeason,
                  episode: previousEpisode.episode_number,
              }
            : previousSeason
              ? {
                    route: episodeRoute(
                        previousSeason.season_number,
                        previousSeason.episode_count,
                    ),
                    season: previousSeason.season_number,
                    episode: previousSeason.episode_count,
                }
              : null;
        const next = nextEpisode
            ? {
                  route: episodeRoute(
                      selectedSeason,
                      nextEpisode.episode_number,
                  ),
                  season: selectedSeason,
                  episode: nextEpisode.episode_number,
              }
            : nextSeason
              ? {
                    route: episodeRoute(nextSeason.season_number, 1),
                    season: nextSeason.season_number,
                    episode: 1,
                }
              : null;

        return { previous, next };
    })();

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={t('Watch :title — Beta Movies', { title })} />
            <CatalogNavigation active={active} />
            <CatalogHeader />
            <main className="lg:ml-64">
                <div className="mx-auto max-w-[1500px] px-4 pb-20 sm:px-6 lg:px-10">
                    <div
                        ref={toolbarRef}
                        className="flex flex-wrap items-center justify-between gap-4 py-4"
                    >
                        <Link
                            href={detailsRoute}
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-white"
                        >
                            <ArrowLeft className="size-4" />{' '}
                            {t('Back to details')}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href={catalogRoute}
                                className="text-sm font-bold text-slate-500 transition hover:text-slate-200"
                            >
                                {t(
                                    mediaType === 'movie'
                                        ? 'All movies'
                                        : 'All TV shows',
                                )}
                            </Link>
                            <WatchlistButton
                                media={{
                                    id: media.id,
                                    title,
                                    year: releaseDate
                                        ? Number(releaseDate.slice(0, 4))
                                        : null,
                                    score: Number(
                                        media.vote_average ?? 0,
                                    ).toFixed(1),
                                    genre:
                                        media.genres?.[0]?.name ?? t('Other'),
                                    type:
                                        mediaType === 'movie'
                                            ? 'film'
                                            : 'serial',
                                    poster: media.poster_path ?? null,
                                }}
                            />
                        </div>
                    </div>

                    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1221] shadow-2xl shadow-black/30">
                        <div className="flex w-full justify-center bg-black">
                            <div
                                ref={playerFrameRef}
                                className="relative aspect-video w-full overflow-hidden bg-black"
                                style={{ maxHeight: playerMaxHeight }}
                            >
                                {!isPlaying && backdropPath && (
                                    <picture>
                                        <source
                                            media={
                                                isEpisodeStill
                                                    ? '(min-width: 360px)'
                                                    : '(min-width: 1600px)'
                                            }
                                            srcSet={originalImage(backdropPath)}
                                        />
                                        <img
                                            {...backdrop}
                                            alt=""
                                            className="absolute inset-0 size-full object-cover opacity-55"
                                            fetchPriority="high"
                                        />
                                    </picture>
                                )}
                                {!isPlaying && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                                )}

                                {isPlaying && selectedPlayer ? (
                                    <iframe
                                        key={selectedPlayer.url}
                                        src={selectedPlayer.url}
                                        title={t('Player :title', { title })}
                                        className="absolute inset-0 size-full"
                                        referrerPolicy="origin"
                                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : selectedPlayer ? (
                                    <button
                                        type="button"
                                        onClick={startPlaying}
                                        className="absolute inset-0 grid size-full cursor-pointer place-items-center"
                                        aria-label={t('Play :title', { title })}
                                    >
                                        <span className="grid size-20 place-items-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-500/30 transition hover:scale-105 hover:bg-sky-400 sm:size-24">
                                            <Play className="ml-1 size-8 fill-current sm:size-10" />
                                        </span>
                                    </button>
                                ) : (
                                    <div className="absolute inset-0 grid place-items-center p-6 text-center">
                                        <div>
                                            <CircleAlert className="mx-auto size-10 text-amber-400" />
                                            <p className="mt-3 font-bold">
                                                {t(
                                                    'No server is currently available.',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="pointer-events-none absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4">
                                    {!isPlaying && (
                                        <div>
                                            <p className="text-xs font-black tracking-[0.2em] text-sky-300 uppercase">
                                                {mediaType === 'movie'
                                                    ? t('Movie')
                                                    : t(
                                                          'Season :season · Episode :episode',
                                                          {
                                                              season:
                                                                  selectedSeason ??
                                                                  '—',
                                                              episode:
                                                                  selectedEpisode ??
                                                                  '—',
                                                          },
                                                      )}
                                            </p>
                                            <h1 className="mt-1 text-xl font-black sm:text-3xl">
                                                {title}
                                                {currentEpisode
                                                    ? ` — ${currentEpisode.name}`
                                                    : ''}
                                            </h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div ref={playerControlsRef}>
                            {mediaType === 'tv' && episodeRoute && (
                                <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/10 p-3 sm:p-4">
                                    <EpisodeNavigationButton
                                        target={episodeTargets.previous}
                                        direction="previous"
                                    />
                                    <span className="hidden text-center text-xs font-black text-slate-500 sm:block">
                                        {t(
                                            'Season :season · Episode :episode',
                                            {
                                                season: selectedSeason ?? '—',
                                                episode: selectedEpisode ?? '—',
                                            },
                                        )}
                                    </span>
                                    <EpisodeNavigationButton
                                        target={episodeTargets.next}
                                        direction="next"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-4 border-t border-white/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                    <Server className="size-4" />{' '}
                                    {t('Available servers')}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {players.map((player) => (
                                        <button
                                            key={player.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedPlayerId(player.id);
                                                startPlaying();
                                            }}
                                            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-black transition ${
                                                selectedPlayer?.id === player.id
                                                    ? 'border-sky-300 bg-sky-400 text-white'
                                                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {selectedPlayer?.id ===
                                                player.id && (
                                                <Check className="size-3.5" />
                                            )}
                                            {player.name}
                                            <span className="text-[10px] opacity-65">
                                                {player.quality}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <WatchInstructions />

                    <div className="mt-4">
                        <div className="space-y-4">
                            {mediaType === 'tv' && episodeRoute && (
                                <section className="rounded-3xl border border-white/8 bg-white/[.03] p-5 sm:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs font-black tracking-[0.18em] text-sky-300 uppercase">
                                                {t('Episodes')}
                                            </p>
                                            <h2 className="mt-1 text-2xl font-black">
                                                {t(
                                                    'Choose a season and episode',
                                                )}
                                            </h2>
                                        </div>
                                        <select
                                            value={selectedSeason ?? ''}
                                            onChange={(event) =>
                                                selectSeason(
                                                    Number(event.target.value),
                                                )
                                            }
                                            className="rounded-xl border border-white/10 bg-[#0a1221] px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-400"
                                            aria-label={t('Choose season')}
                                        >
                                            {seasons.map((season) => (
                                                <option
                                                    key={season.id}
                                                    value={season.season_number}
                                                >
                                                    {season.name} ·{' '}
                                                    {t(
                                                        season.episode_count ===
                                                            1
                                                            ? ':count episode'
                                                            : ':count episodes',
                                                        {
                                                            count: season.episode_count,
                                                        },
                                                    )}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {episodes.map((episode) => {
                                            const isWatched =
                                                watchedEpisodes.includes(
                                                    `${selectedSeason}-${episode.episode_number}`,
                                                );

                                            return (
                                                <Link
                                                    key={episode.id}
                                                    href={episodeRoute(
                                                        selectedSeason ?? 1,
                                                        episode.episode_number,
                                                    )}
                                                    className={`group flex gap-3 rounded-2xl border p-3 transition ${
                                                        episode.episode_number ===
                                                        selectedEpisode
                                                            ? 'border-sky-400/70 bg-sky-500/10'
                                                            : 'border-white/8 bg-black/10 hover:border-white/20 hover:bg-white/5'
                                                    }`}
                                                >
                                                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/6 text-sm font-black text-slate-300 group-hover:text-white">
                                                        {episode.episode_number}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-sm font-bold text-white">
                                                                {episode.name ||
                                                                    t(
                                                                        'Episode :episode',
                                                                        {
                                                                            episode:
                                                                                episode.episode_number,
                                                                        },
                                                                    )}
                                                            </p>
                                                            {isWatched && (
                                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-black text-emerald-300 uppercase">
                                                                    <Check className="size-3" />
                                                                    {t(
                                                                        'Watched',
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {formatAirDate(
                                                                episode.air_date,
                                                                localeTag,
                                                            ) ||
                                                                t(
                                                                    'Date unavailable',
                                                                )}
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            <section className="rounded-3xl border border-white/8 bg-white/[.03] p-5 sm:p-6">
                                <div className="flex flex-col gap-5 sm:flex-row">
                                    <div className="w-28 shrink-0 overflow-hidden rounded-xl bg-slate-900 sm:w-36">
                                        {media.poster_path ? (
                                            <img
                                                {...posterImage(
                                                    media.poster_path,
                                                    '(min-width: 640px) 144px, 112px',
                                                )}
                                                alt={title}
                                                className="aspect-[2/3] size-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="grid aspect-[2/3] place-items-center">
                                                <Film className="size-9 text-slate-700" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black">
                                            {title}
                                        </h2>
                                        {media.tagline && (
                                            <p className="mt-1 text-sm font-bold text-sky-300">
                                                {media.tagline}
                                            </p>
                                        )}
                                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                            <span className="inline-flex items-center gap-1 font-black text-amber-400">
                                                <Star className="size-4 fill-current" />
                                                {Number(
                                                    media.vote_average ?? 0,
                                                ).toLocaleString(localeTag, {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 1,
                                                })}
                                            </span>
                                            {releaseDate && (
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDays className="size-4" />
                                                    {releaseDate.slice(0, 4)}
                                                </span>
                                            )}
                                            {(currentEpisode?.runtime ??
                                                media.runtime) && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock3 className="size-4" />
                                                    {currentEpisode?.runtime ??
                                                        media.runtime}{' '}
                                                    min
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {media.genres?.map((genre) => (
                                                <span
                                                    key={genre.id}
                                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                                            {currentEpisode?.overview ||
                                                media.overview ||
                                                t('Description unavailable.')}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
