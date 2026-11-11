import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
export const update = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/admin/tmdb/ratings/tv/{series}/{season}/{episode}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
update.url = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            series: args[0],
            season: args[1],
            episode: args[2],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        series: args.series,
        season: args.season,
        episode: args.episode,
    };

    return (
        update.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace('{season}', parsedArgs.season.toString())
            .replace('{episode}', parsedArgs.episode.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
update.put = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
const updateForm = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
updateForm.put = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

update.form = updateForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
export const destroy = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/ratings/tv/{series}/{season}/{episode}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
destroy.url = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            series: args[0],
            season: args[1],
            episode: args[2],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        series: args.series,
        season: args.season,
        episode: args.episode,
    };

    return (
        destroy.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace('{season}', parsedArgs.season.toString())
            .replace('{episode}', parsedArgs.episode.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
destroy.delete = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
const destroyForm = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
destroyForm.delete = (
    args:
        | {
              series: string | number;
              season: string | number;
              episode: string | number;
          }
        | [
              series: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;

const episodeRatings = {
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default episodeRatings;
