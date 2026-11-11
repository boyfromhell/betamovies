import {
    AppError,
    pageNumber,
    object,
    pick,
    positiveId,
    rows,
    slug,
    text,
    type JsonObject,
    type Locale,
    type MediaType,
} from '../types.ts';
import { TmdbClient, type Query } from './client.ts';

const sharedLists = [
    { value: 'popular', label: 'Popular', supportsGenres: true },
    { value: 'trending_day', label: 'Trending today', supportsGenres: false },
    {
        value: 'trending_week',
        label: 'Trending this week',
        supportsGenres: false,
    },
    { value: 'top_rated', label: 'Top rated', supportsGenres: true },
];
export const catalogLists = (type: MediaType) => [
    ...sharedLists,
    ...(type === 'movie'
        ? [
              {
                  value: 'now_playing',
                  label: 'Now playing',
                  supportsGenres: false,
              },
              { value: 'upcoming', label: 'Upcoming', supportsGenres: false },
              {
                  value: 'newest',
                  label: 'Newest releases',
                  supportsGenres: true,
              },
          ]
        : [
              {
                  value: 'airing_today',
                  label: 'Airing today',
                  supportsGenres: false,
              },
              {
                  value: 'on_the_air',
                  label: 'On the air',
                  supportsGenres: false,
              },
              {
                  value: 'newest',
                  label: 'Newest TV shows',
                  supportsGenres: true,
              },
          ]),
];

export class Catalog {
    readonly language: string;
    constructor(
        readonly client: TmdbClient,
        locale: Locale,
        private region: string,
    ) {
        this.language = locale === 'ro' ? 'ro-RO' : 'en-US';
    }
    options(extra: Query = {}, withRegion = false): Query {
        return {
            language: this.language,
            ...(withRegion ? { region: this.region } : {}),
            ...extra,
        };
    }
    async genres(type: MediaType): Promise<JsonObject[]> {
        return rows(
            (
                await this.client.request(`/genre/${type}/list`, {
                    language: this.language,
                })
            ).genres,
        ).map((item) => pick(item, ['id', 'name']));
    }

    mapItem(
        item: JsonObject,
        type: MediaType,
        genres: JsonObject[],
    ): JsonObject {
        const date = text(item.release_date ?? item.first_air_date);
        const first = Array.isArray(item.genre_ids)
            ? item.genre_ids[0]
            : rows(item.genres)[0]?.id;
        return {
            id: Number(item.id),
            title: text(item.title ?? item.name, 'Title unavailable'),
            year: /^\d{4}/.test(date) ? Number(date.slice(0, 4)) : null,
            score: (Number(item.vote_average) || 0).toFixed(1),
            genre: text(
                genres.find((genre) => genre.id === first)?.name,
                this.language === 'ro-RO' ? 'Altele' : 'Other',
            ),
            type: type === 'movie' ? 'film' : 'serial',
            runtime: type === 'movie' ? 'Movie' : 'TV Show',
            poster: item.poster_path ?? null,
            backdrop: item.backdrop_path ?? null,
            description: text(item.overview),
        };
    }

    paginated(data: JsonObject): JsonObject {
        if (
            !Array.isArray(data.results) ||
            !Number.isInteger(data.page) ||
            Number(data.page) < 1 ||
            !Number.isInteger(data.total_pages) ||
            Number(data.total_pages) < 0 ||
            !Number.isInteger(data.total_results) ||
            Number(data.total_results) < 0
        ) {
            throw new AppError(
                502,
                'TMDB returned an invalid paginated response.',
                'invalid_response',
            );
        }
        return {
            items: rows(data.results),
            page: Number(data.page) || 1,
            totalPages: Number(data.total_pages) || 0,
            totalResults: Number(data.total_results) || 0,
        };
    }

    async home(recentEpisodes: JsonObject[]): Promise<JsonObject> {
        const [movies, nowPlaying, shows, movieGenres, tvGenres] =
            await Promise.all([
                this.client.request('/movie/popular', this.options({}, true)),
                this.client.request(
                    '/movie/now_playing',
                    this.options({}, true),
                ),
                this.client.request('/trending/tv/day', {
                    language: this.language,
                }),
                this.genres('movie'),
                this.genres('tv'),
            ]);
        for (const data of [movies, nowPlaying, shows]) {
            this.paginated(data);
        }
        return {
            popularMovies: rows(movies.results)
                .slice(0, 18)
                .map((item) => this.mapItem(item, 'movie', movieGenres)),
            nowPlayingMovies: rows(nowPlaying.results)
                .slice(0, 18)
                .map((item) => this.mapItem(item, 'movie', movieGenres)),
            trendingSeries: rows(shows.results)
                .slice(0, 18)
                .map((item) => this.mapItem(item, 'tv', tvGenres)),
            recentEpisodes,
            tmdbAvailable: true,
        };
    }

    async index(type: MediaType, params: URLSearchParams): Promise<JsonObject> {
        const page = pageNumber(params.get('page'));
        const list = params.get('list') || 'popular';
        const selected = catalogLists(type).find((item) => item.value === list);
        if (!selected) {
            throw new AppError(422, 'Invalid catalog list.');
        }
        const genres = await this.genres(type);
        const genre = selected.supportsGenres ? params.get('genre') : null;
        if (genre && !genres.some((item) => item.id === Number(genre))) {
            throw new AppError(422, 'Invalid genre.');
        }
        const query = (params.get('q') ?? '').trim().slice(0, 200);
        let path = `/discover/${type}`;
        let filters: Query = genre ? { with_genres: genre } : {};
        if (query) {
            path = `/search/${type}`;
            filters = { query };
        } else if (list.startsWith('trending_')) {
            path = `/trending/${type}/${list === 'trending_week' ? 'week' : 'day'}`;
        } else if (list === 'newest') {
            filters = {
                ...filters,
                sort_by:
                    type === 'movie'
                        ? 'primary_release_date.desc'
                        : 'first_air_date.desc',
                [type === 'movie'
                    ? 'primary_release_date.lte'
                    : 'first_air_date.lte']: new Date()
                    .toISOString()
                    .slice(0, 10),
            };
        } else if (list === 'top_rated' && genre) {
            filters = {
                ...filters,
                sort_by: 'vote_average.desc',
                'vote_count.gte': 200,
                include_adult: false,
                ...(type === 'movie'
                    ? { without_genres: '99,10755', include_video: false }
                    : {}),
            };
        } else if (list !== 'popular') {
            path = `/${type}/${list}`;
        }
        const data = await this.client.request(
            path,
            this.options(
                { ...filters, page },
                type === 'movie' && !path.startsWith('/trending/'),
            ),
        );
        this.paginated(data);
        return {
            catalog: {
                items: rows(data.results).map((item) =>
                    this.mapItem(item, type, genres),
                ),
                page: Number(data.page) || page,
                totalPages: Math.min(500, Number(data.total_pages) || 0),
                totalResults: Number(data.total_results) || 0,
            },
            genres,
            filters: { list, genre, q: query || null },
            lists: catalogLists(type),
            tmdbAvailable: true,
        };
    }

    async search(query: string): Promise<JsonObject[]> {
        if (query.trim().length < 2) {
            return [];
        }
        const [data, movieGenres, tvGenres] = await Promise.all([
            this.client.request(
                '/search/multi',
                this.options({
                    query: query.trim().slice(0, 200),
                    include_adult: false,
                }),
            ),
            this.genres('movie'),
            this.genres('tv'),
        ]);
        return rows(data.results)
            .filter((item) =>
                ['movie', 'tv', 'person'].includes(text(item.media_type)),
            )
            .slice(0, 12)
            .map((item) =>
                item.media_type === 'person'
                    ? {
                          id: item.id,
                          title: item.name,
                          slug: slug(item.name, `person-${Number(item.id)}`),
                          type: 'person',
                          poster: item.profile_path ?? null,
                          department: item.known_for_department ?? null,
                      }
                    : this.mapItem(
                          item,
                          item.media_type === 'movie' ? 'movie' : 'tv',
                          item.media_type === 'movie' ? movieGenres : tvGenres,
                      ),
            );
    }

    async rawDetails(type: MediaType, id: number): Promise<JsonObject> {
        return this.client.request(`/${type}/${id}`, {
            language: this.language,
            append_to_response: `${type === 'movie' ? 'credits' : 'aggregate_credits'},videos,recommendations,external_ids`,
        });
    }

    detailsPayload(media: JsonObject, type: MediaType): JsonObject {
        const result = pick(media, [
            'id',
            'title',
            'name',
            'overview',
            'backdrop_path',
            'poster_path',
            'release_date',
            'first_air_date',
            'runtime',
            'episode_run_time',
            'number_of_seasons',
            'status',
            'vote_average',
            'tagline',
        ]);
        result.genres = rows(media.genres).map((item) =>
            pick(item, ['id', 'name']),
        );
        const key = type === 'movie' ? 'credits' : 'aggregate_credits';
        result[key] = {
            cast: rows(object(media[key]).cast)
                .slice(0, 8)
                .map((person) => ({
                    ...pick(person, ['id', 'name', 'character']),
                    slug: slug(person.name, `person-${Number(person.id)}`),
                    ...(Array.isArray(person.roles)
                        ? {
                              roles: rows(person.roles)
                                  .slice(0, 1)
                                  .map((role) => pick(role, ['character'])),
                          }
                        : {}),
                })),
        };
        const videos = rows(object(media.videos).results).filter(
            (video) => video.site === 'YouTube',
        );
        const trailer =
            videos.find(
                (video) => video.type === 'Trailer' && video.official === true,
            ) ?? videos[0];
        result.videos = {
            results: trailer
                ? [
                      pick(trailer, [
                          'id',
                          'key',
                          'name',
                          'site',
                          'type',
                          'official',
                      ]),
                  ]
                : [],
        };
        result.recommendations = {
            results: rows(object(media.recommendations).results)
                .slice(0, 6)
                .map((item) =>
                    pick(item, [
                        'id',
                        'title',
                        'name',
                        'poster_path',
                        'vote_average',
                    ]),
                ),
        };
        return result;
    }

    async person(id: number, page: number): Promise<JsonObject> {
        const data = await this.client.request(`/person/${id}`, {
            language: this.language,
            append_to_response: 'combined_credits',
        });
        const person = {
            ...pick(data, [
                'id',
                'name',
                'biography',
                'profile_path',
                'known_for_department',
                'birthday',
                'deathday',
                'place_of_birth',
            ]),
            slug: slug(data.name, `person-${id}`),
        };
        const credits = new Map<string, JsonObject>();
        for (const category of ['cast', 'crew']) {
            for (const item of rows(object(data.combined_credits)[category])) {
                if (
                    !['movie', 'tv'].includes(text(item.media_type)) ||
                    !Number.isSafeInteger(item.id) ||
                    Number(item.id) < 1
                ) {
                    continue;
                }
                const key = `${text(item.media_type)}:${Number(item.id)}`;
                const date = text(item.release_date ?? item.first_air_date);
                const entry = credits.get(key) ?? {
                    id: item.id,
                    mediaType: item.media_type,
                    title: text(item.title ?? item.name),
                    year: /^\d{4}/.test(date) ? Number(date.slice(0, 4)) : null,
                    poster: item.poster_path ?? null,
                    score: (Number(item.vote_average) || 0).toFixed(1),
                    roles: [],
                    popularity: Number(item.popularity) || 0,
                };
                const role = text(item.character ?? item.job).trim();
                if (role && !(entry.roles as string[]).includes(role)) {
                    (entry.roles as string[]).push(role);
                }
                credits.set(key, entry);
            }
        }
        const filmography = [...credits.values()]
            .sort(
                (a, b) =>
                    Number(b.popularity) - Number(a.popularity) ||
                    Number(b.year) - Number(a.year) ||
                    text(a.title).localeCompare(text(b.title)) ||
                    Number(a.id) - Number(b.id),
            )
            .map((item) =>
                pick(item, [
                    'id',
                    'mediaType',
                    'title',
                    'year',
                    'poster',
                    'score',
                    'roles',
                ]),
            );
        const totalPages = Math.max(1, Math.ceil(filmography.length / 24));
        if (page > totalPages) {
            throw new AppError(404, 'Page not found.');
        }
        return {
            person,
            filmography,
            pagination: { page, perPage: 24, totalPages },
        };
    }

    watchRoute(
        media: JsonObject,
        type: MediaType,
    ): { url: string; method: 'get' } {
        const id = positiveId(media.id);
        return {
            url:
                type === 'movie'
                    ? `/movie/${id}/${slug(media.title, `movie-${id}`)}/watch`
                    : `/series/${id}/${slug(media.name, `series-${id}`)}/watch`,
            method: 'get',
        };
    }
}
