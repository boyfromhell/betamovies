import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
export const store = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/admin/tmdb/favorites/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
store.url = (
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
        store.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
store.post = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
const storeForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:66
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
 */
storeForm.post = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
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
    url: '/admin/tmdb/favorites/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
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
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
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
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
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
 * @see app/Http/Controllers/Admin/TmdbController.php:71
 * @route '/admin/tmdb/favorites/{mediaType}/{mediaId}'
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

const favorites = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
};

export default favorites;
