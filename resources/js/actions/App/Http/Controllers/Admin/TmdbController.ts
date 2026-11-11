import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../../wayfinder';
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

/**
 * @see \App\Http\Controllers\Admin\TmdbController::favorite
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
export const favorite = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: favorite.url(args, options),
    method: 'post',
});

favorite.definition = {
    methods: ['post'],
    url: '/admin/tmdb/favorites/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::favorite
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
favorite.url = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            mediaType: args[0],
            mediaId: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        mediaType: args.mediaType,
        mediaId: args.mediaId,
    };

    return (
        favorite.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::favorite
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
favorite.post = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: favorite.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::favorite
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
const favoriteForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: favorite.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::favorite
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
favoriteForm.post = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: favorite.url(args, options),
    method: 'post',
});

favorite.form = favoriteForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::unfavorite
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
export const unfavorite = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: unfavorite.url(args, options),
    method: 'delete',
});

unfavorite.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/favorites/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::unfavorite
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
unfavorite.url = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            mediaType: args[0],
            mediaId: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        mediaType: args.mediaType,
        mediaId: args.mediaId,
    };

    return (
        unfavorite.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::unfavorite
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
unfavorite.delete = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: unfavorite.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::unfavorite
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
const unfavoriteForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: unfavorite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::unfavorite
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
unfavoriteForm.delete = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: unfavorite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

unfavorite.form = unfavoriteForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rate
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
export const rate = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: rate.url(args, options),
    method: 'put',
});

rate.definition = {
    methods: ['put'],
    url: '/admin/tmdb/ratings/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rate
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
rate.url = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            mediaType: args[0],
            mediaId: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        mediaType: args.mediaType,
        mediaId: args.mediaId,
    };

    return (
        rate.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rate
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
rate.put = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: rate.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rate
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
const rateForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: rate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rate
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
rateForm.put = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: rate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

rate.form = rateForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteRating
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
export const deleteRating = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: deleteRating.url(args, options),
    method: 'delete',
});

deleteRating.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/ratings/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteRating
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
deleteRating.url = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            mediaType: args[0],
            mediaId: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        mediaType: args.mediaType,
        mediaId: args.mediaId,
    };

    return (
        deleteRating.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteRating
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
deleteRating.delete = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: deleteRating.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteRating
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
const deleteRatingForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: deleteRating.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteRating
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
deleteRatingForm.delete = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: deleteRating.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

deleteRating.form = deleteRatingForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rateEpisode
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
export const rateEpisode = (
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
    url: rateEpisode.url(args, options),
    method: 'put',
});

rateEpisode.definition = {
    methods: ['put'],
    url: '/admin/tmdb/ratings/tv/{series}/{season}/{episode}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rateEpisode
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
rateEpisode.url = (
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
        rateEpisode.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace('{season}', parsedArgs.season.toString())
            .replace('{episode}', parsedArgs.episode.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rateEpisode
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
rateEpisode.put = (
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
    url: rateEpisode.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rateEpisode
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
const rateEpisodeForm = (
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
    action: rateEpisode.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::rateEpisode
 * @see app/Http/Controllers/Admin/TmdbController.php:98
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
rateEpisodeForm.put = (
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
    action: rateEpisode.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

rateEpisode.form = rateEpisodeForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteEpisodeRating
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
export const deleteEpisodeRating = (
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
    url: deleteEpisodeRating.url(args, options),
    method: 'delete',
});

deleteEpisodeRating.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/ratings/tv/{series}/{season}/{episode}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteEpisodeRating
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
deleteEpisodeRating.url = (
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
        deleteEpisodeRating.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace('{season}', parsedArgs.season.toString())
            .replace('{episode}', parsedArgs.episode.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteEpisodeRating
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
deleteEpisodeRating.delete = (
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
    url: deleteEpisodeRating.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteEpisodeRating
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
const deleteEpisodeRatingForm = (
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
    action: deleteEpisodeRating.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteEpisodeRating
 * @see app/Http/Controllers/Admin/TmdbController.php:106
 * @route '/admin/tmdb/ratings/tv/{series}/{season}/{episode}'
 */
deleteEpisodeRatingForm.delete = (
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
    action: deleteEpisodeRating.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

deleteEpisodeRating.form = deleteEpisodeRatingForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::createList
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
export const createList = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: createList.url(options),
    method: 'post',
});

createList.definition = {
    methods: ['post'],
    url: '/admin/tmdb/lists',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::createList
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
createList.url = (options?: RouteQueryOptions) => {
    return createList.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::createList
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
createList.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createList.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::createList
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
const createListForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: createList.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::createList
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
createListForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: createList.url(options),
    method: 'post',
});

createList.form = createListForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::addListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
export const addListMovie = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: addListMovie.url(args, options),
    method: 'post',
});

addListMovie.definition = {
    methods: ['post'],
    url: '/admin/tmdb/lists/{list}/movies/{movie}',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::addListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
addListMovie.url = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            list: args[0],
            movie: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
        movie: args.movie,
    };

    return (
        addListMovie.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace('{movie}', parsedArgs.movie.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::addListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
addListMovie.post = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: addListMovie.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::addListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
const addListMovieForm = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: addListMovie.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::addListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
addListMovieForm.post = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: addListMovie.url(args, options),
    method: 'post',
});

addListMovie.form = addListMovieForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::removeListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
export const removeListMovie = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: removeListMovie.url(args, options),
    method: 'delete',
});

removeListMovie.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/lists/{list}/movies/{movie}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::removeListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
removeListMovie.url = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            list: args[0],
            movie: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
        movie: args.movie,
    };

    return (
        removeListMovie.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace('{movie}', parsedArgs.movie.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::removeListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
removeListMovie.delete = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: removeListMovie.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::removeListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
const removeListMovieForm = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: removeListMovie.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::removeListMovie
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
removeListMovieForm.delete = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: removeListMovie.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

removeListMovie.form = removeListMovieForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clearList
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
export const clearList = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: clearList.url(args, options),
    method: 'patch',
});

clearList.definition = {
    methods: ['patch'],
    url: '/admin/tmdb/lists/{list}/clear',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clearList
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
clearList.url = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { list: args };
    }

    if (Array.isArray(args)) {
        args = {
            list: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
    };

    return (
        clearList.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clearList
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
clearList.patch = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: clearList.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clearList
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
const clearListForm = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: clearList.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clearList
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
clearListForm.patch = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: clearList.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

clearList.form = clearListForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteList
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
export const deleteList = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: deleteList.url(args, options),
    method: 'delete',
});

deleteList.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/lists/{list}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteList
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
deleteList.url = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { list: args };
    }

    if (Array.isArray(args)) {
        args = {
            list: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
    };

    return (
        deleteList.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteList
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
deleteList.delete = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: deleteList.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteList
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
const deleteListForm = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: deleteList.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::deleteList
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
deleteListForm.delete = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: deleteList.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

deleteList.form = deleteListForm;

const TmdbController = {
    index,
    favorite,
    unfavorite,
    rate,
    deleteRating,
    rateEpisode,
    deleteEpisodeRating,
    createList,
    addListMovie,
    removeListMovie,
    clearList,
    deleteList,
};

export default TmdbController;
