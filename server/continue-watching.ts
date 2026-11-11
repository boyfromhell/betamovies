import { Catalog } from './tmdb/catalog.ts';
import { AppError, rows, type JsonObject } from './types.ts';

export async function continueWatchingEpisode(
    catalog: Catalog,
    id: number,
    season: number,
    episode: number,
): Promise<{ season: number; episode: number }> {
    const current = { season, episode };
    const latest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const aired = (item: JsonObject): boolean =>
        typeof item.air_date === 'string' &&
        item.air_date !== '' &&
        item.air_date <= latest;
    const series = await catalog.client.request(`/tv/${id}`, {
        language: catalog.language,
    });
    const seasons = rows(series.seasons).sort(
        (a, b) => Number(a.season_number) - Number(b.season_number),
    );
    const selected = seasons.find(
        (item) => Number(item.season_number) === season,
    );
    if (!selected || Number(selected.episode_count) < 1 || !aired(selected)) {
        throw new AppError(404, 'This season has not aired yet.');
    }
    const details = await catalog.client.request(`/tv/${id}/season/${season}`, {
        language: catalog.language,
    });
    const episodes = rows(details.episodes).sort(
        (a, b) => Number(a.episode_number) - Number(b.episode_number),
    );
    const selectedEpisode = episodes.find(
        (item) => Number(item.episode_number) === episode,
    );
    if (!selectedEpisode || !aired(selectedEpisode)) {
        throw new AppError(404, 'This episode has not aired yet.');
    }
    const nextEpisode = episodes.find(
        (item) => Number(item.episode_number) > episode,
    );
    if (nextEpisode) {
        return aired(nextEpisode)
            ? { season, episode: Number(nextEpisode.episode_number) }
            : current;
    }
    if (Number(selected.episode_count) > episodes.length) {
        return current;
    }
    const nextSeason = seasons.find(
        (item) => Number(item.season_number) > season,
    );
    if (
        !nextSeason ||
        Number(nextSeason.episode_count) < 1 ||
        !aired(nextSeason)
    ) {
        return current;
    }
    const nextDetails = await catalog.client.request(
        `/tv/${id}/season/${Number(nextSeason.season_number)}`,
        { language: catalog.language },
    );
    const firstEpisode = rows(nextDetails.episodes).sort(
        (a, b) => Number(a.episode_number) - Number(b.episode_number),
    )[0];
    return firstEpisode && aired(firstEpisode)
        ? {
              season: Number(nextSeason.season_number),
              episode: Number(firstEpisode.episode_number),
          }
        : current;
}
