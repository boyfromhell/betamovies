import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
export const update = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/admin/tmdb/ratings/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
update.url = (
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
        update.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
update.put = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::update
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
const updateForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
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
 * @see app/Http/Controllers/Admin/TmdbController.php:76
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
updateForm.put = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
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
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
export const destroy = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/ratings/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
destroy.url = (
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
        destroy.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
destroy.delete = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
const destroyForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
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
 * @see app/Http/Controllers/Admin/TmdbController.php:88
 * @route '/admin/tmdb/ratings/{mediaType}/{mediaId}'
 */
destroyForm.delete = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
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

const ratings = {
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default ratings;
