import { describe, expect, it } from 'vite-plus/test';
import type { WatchHistoryEntry } from '@/lib/watch-history';
import {
    continueHistoryRoute,
    lastHistoryEpisode,
} from '@/lib/watch-history-navigation';

const historyEntry = (
    changes: Partial<WatchHistoryEntry> = {},
): WatchHistoryEntry => ({
    showId: 50,
    mediaId: 50,
    type: 'tv',
    title: 'A show',
    slug: 'a-show',
    posterPath: null,
    lastSelectedSeason: null,
    lastSelectedEpisode: null,
    lastWatchedSeason: null,
    lastWatchedEpisode: null,
    watchedEpisodes: [],
    updatedAt: 1000,
    ...changes,
});

describe('continue watching navigation', () => {
    it('opens the selected episode ahead of the last watched episode', () => {
        const entry = historyEntry({
            lastSelectedSeason: 3,
            lastSelectedEpisode: 2,
            lastWatchedSeason: 2,
            lastWatchedEpisode: 8,
        });

        expect(lastHistoryEpisode(entry)).toStrictEqual({
            season: 3,
            episode: 2,
        });
        expect(continueHistoryRoute(entry)).toStrictEqual({
            url: '/series/50/a-show/watch/3/2',
            method: 'get',
        });
    });

    it('uses a complete watched episode when the selected episode is incomplete', () => {
        const entry = historyEntry({
            lastSelectedSeason: 4,
            lastSelectedEpisode: null,
            lastWatchedSeason: 2,
            lastWatchedEpisode: 8,
        });

        expect(lastHistoryEpisode(entry)).toStrictEqual({
            season: 2,
            episode: 8,
        });
        expect(continueHistoryRoute(entry).url).toBe(
            '/series/50/a-show/watch/2/8?resume=next',
        );
    });

    it('requests the next available episode when the selected episode is watched', () => {
        const entry = historyEntry({
            lastSelectedSeason: 3,
            lastSelectedEpisode: 2,
            watchedEpisodes: ['3-2'],
        });

        expect(continueHistoryRoute(entry).url).toBe(
            '/series/50/a-show/watch/3/2?resume=next',
        );
    });

    it('opens TV details instead of combining two incomplete episode pairs', () => {
        const entry = historyEntry({
            lastSelectedSeason: 4,
            lastSelectedEpisode: null,
            lastWatchedSeason: null,
            lastWatchedEpisode: 8,
        });

        expect(lastHistoryEpisode(entry)).toBeNull();
        expect(continueHistoryRoute(entry)).toStrictEqual({
            url: '/series/50',
            method: 'get',
        });
    });

    it('opens movie playback with the media ID rather than its history store ID', () => {
        const entry = historyEntry({
            type: 'movie',
            showId: 1000000042,
            mediaId: 42,
            slug: 'a-movie',
        });

        expect(continueHistoryRoute(entry)).toStrictEqual({
            url: '/movie/42/a-movie/watch',
            method: 'get',
        });
    });
});
