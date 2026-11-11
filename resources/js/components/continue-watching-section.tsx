import { Link } from '@inertiajs/react';
import { Film, Play, Tv } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HomeMediaRail } from '@/components/home-media-rail';
import { useTranslation } from '@/hooks/use-translation';
import { posterImage, railPosterSizes } from '@/lib/tmdb-images';
import { watchHistory, type WatchHistoryEntry } from '@/lib/watch-history';
import {
    continueHistoryRoute,
    lastHistoryEpisode,
} from '@/lib/watch-history-navigation';
import { index as historyIndex } from '@/routes/history';

const historyLimit = 18;

export function ContinueWatchingSection() {
    const { t } = useTranslation();
    const [entries, setEntries] = useState<WatchHistoryEntry[]>([]);

    useEffect(() => {
        let isActive = true;
        let readVersion = 0;

        const loadHistory = async () => {
            const currentVersion = ++readVersion;

            try {
                const storedEntries = await watchHistory.all();

                if (isActive && currentVersion === readVersion) {
                    setEntries(storedEntries.slice(0, historyLimit));
                }
            } catch {
                if (isActive && currentVersion === readVersion) {
                    setEntries([]);
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

    if (entries.length === 0) {
        return null;
    }

    return (
        <HomeMediaRail
            title="Continue watching"
            subtitle="Continue movies and TV shows where you left off."
            href={historyIndex()}
        >
            {entries.map((entry) => {
                const episode =
                    entry.type === 'tv' ? lastHistoryEpisode(entry) : null;
                const title = episode
                    ? t(':title — Season :season, Episode :episode', {
                          title: entry.title,
                          season: episode.season,
                          episode: episode.episode,
                      })
                    : entry.title;
                const FallbackIcon = entry.type === 'movie' ? Film : Tv;

                return (
                    <Link
                        key={entry.showId}
                        href={continueHistoryRoute(entry)}
                        prefetch
                        className="group block min-w-0 snap-start"
                        aria-label={t('Continue :title', { title })}
                        title={title}
                    >
                        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/8 bg-slate-900 shadow-[0_18px_50px_rgba(0,0,0,.22)] transition duration-300 group-hover:-translate-y-1 group-hover:border-sky-400/30">
                            {entry.posterPath ? (
                                <img
                                    {...posterImage(
                                        entry.posterPath,
                                        railPosterSizes,
                                    )}
                                    alt={entry.title}
                                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                <span className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                                    <FallbackIcon className="size-12" />
                                </span>
                            )}
                            <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                            <span className="absolute top-3 left-3 rounded-lg bg-slate-950/85 px-2.5 py-1.5 text-[10px] font-black tracking-wide text-white backdrop-blur">
                                {t(
                                    entry.type === 'movie'
                                        ? 'MOVIE'
                                        : 'TV SHOW',
                                )}
                            </span>
                            <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                                <span className="grid size-12 place-items-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-950/40">
                                    <Play className="ml-0.5 size-5 fill-current" />
                                </span>
                            </span>
                        </div>
                        <h3 className="mt-3 truncate text-sm font-bold text-white sm:text-[15px]">
                            {entry.title}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-400">
                            {episode
                                ? t('Season :season · Episode :episode', {
                                      season: episode.season,
                                      episode: episode.episode,
                                  })
                                : t('Watch now')}
                        </p>
                    </Link>
                );
            })}
        </HomeMediaRail>
    );
}
