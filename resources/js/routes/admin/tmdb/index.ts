import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../wayfinder';
import connection from './connection';
import favorites from './favorites';
import ratings from './ratings';
import episodeRatings from './episode-ratings';
import lists from './lists';
/**
 * @see \App\Http\Controllers\Admin\TmdbController::index
 * @see app/Http/Controllers/Admin/TmdbController.php:22
 * @route '/admin/tmdb'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/admin/tmdb',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::index
 * @see app/Http/Controllers/Admin/TmdbController.php:22
 * @route '/admin/tmdb'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::index
 * @see app/Http/Controllers/Admin/TmdbController.php:22
 * @route '/admin/tmdb'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::index
 * @see app/Http/Controllers/Admin/TmdbController.php:22
 * @route '/admin/tmdb'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::index
 * @see app/Http/Controllers/Admin/TmdbController.php:22
 * @route '/admin/tmdb'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::index
 * @see app/Http/Controllers/Admin/TmdbController.php:22
 * @route '/admin/tmdb'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::index
 * @see app/Http/Controllers/Admin/TmdbController.php:22
 * @route '/admin/tmdb'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

index.form = indexForm;

const tmdb = {
    index: Object.assign(index, index),
    connection: Object.assign(connection, connection),
    favorites: Object.assign(favorites, favorites),
    ratings: Object.assign(ratings, ratings),
    episodeRatings: Object.assign(episodeRatings, episodeRatings),
    lists: Object.assign(lists, lists),
};

export default tmdb;
