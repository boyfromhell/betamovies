import type { WatchHistoryEntry } from '@/lib/watch-history';
import { watch as movieWatch } from '@/routes/movies';
import { show as seriesShow, watch as seriesWatch } from '@/routes/series';

export function lastHistoryEpisode(
    entry: WatchHistoryEntry,
): { season: number; episode: number } | null {
    if (
        entry.lastSelectedSeason !== null &&
        entry.lastSelectedEpisode !== null
    ) {
        return {
            season: entry.lastSelectedSeason,
            episode: entry.lastSelectedEpisode,
        };
    }

    if (entry.lastWatchedSeason !== null && entry.lastWatchedEpisode !== null) {
        return {
            season: entry.lastWatchedSeason,
            episode: entry.lastWatchedEpisode,
        };
    }

    return null;
}

export function continueHistoryRoute(entry: WatchHistoryEntry) {
    if (entry.type === 'movie') {
        return movieWatch({ movie: entry.mediaId, name: entry.slug });
    }

    const episode = lastHistoryEpisode(entry);

    if (!episode) {
        return seriesShow(entry.mediaId);
    }

    const watched =
        entry.watchedEpisodes.includes(
            `${episode.season}-${episode.episode}`,
        ) ||
        (entry.lastWatchedSeason === episode.season &&
            entry.lastWatchedEpisode === episode.episode);

    return seriesWatch(
        {
            series: entry.mediaId,
            name: entry.slug,
            season: episode.season,
            episode: episode.episode,
        },
        watched ? { query: { resume: 'next' } } : undefined,
    );
}
