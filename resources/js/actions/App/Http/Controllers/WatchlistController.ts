import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:19
 * @route '/watchlist'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/watchlist',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:19
 * @route '/watchlist'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:19
 * @route '/watchlist'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:19
 * @route '/watchlist'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:19
 * @route '/watchlist'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:19
 * @route '/watchlist'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchlistController::index
 * @see app/Http/Controllers/WatchlistController.php:19
 * @route '/watchlist'
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
 * @see \App\Http\Controllers\WatchlistController::show
 * @see app/Http/Controllers/WatchlistController.php:51
 * @route '/watchlist/{mediaType}/{mediaId}'
 */
export const show = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/watchlist/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\WatchlistController::show
 * @see app/Http/Controllers/WatchlistController.php:51
 * @route '/watchlist/{mediaType}/{mediaId}'
 */
show.url = (
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
        show.definition.url
            .replace('{mediaType}', parsedArgs.mediaType.toString())
            .replace('{mediaId}', parsedArgs.mediaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\WatchlistController::show
 * @see app/Http/Controllers/WatchlistController.php:51
 * @route '/watchlist/{mediaType}/{mediaId}'
 */
show.get = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchlistController::show
 * @see app/Http/Controllers/WatchlistController.php:51
 * @route '/watchlist/{mediaType}/{mediaId}'
 */
show.head = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\WatchlistController::show
 * @see app/Http/Controllers/WatchlistController.php:51
 * @route '/watchlist/{mediaType}/{mediaId}'
 */
const showForm = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchlistController::show
 * @see app/Http/Controllers/WatchlistController.php:51
 * @route '/watchlist/{mediaType}/{mediaId}'
 */
showForm.get = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchlistController::show
 * @see app/Http/Controllers/WatchlistController.php:51
 * @route '/watchlist/{mediaType}/{mediaId}'
 */
showForm.head = (
    args:
        | { mediaType: string | number; mediaId: string | number }
        | [mediaType: string | number, mediaId: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

show.form = showForm;

/**
 * @see \App\Http\Controllers\WatchlistController::store
 * @see app/Http/Controllers/WatchlistController.php:62
 * @route '/watchlist/{mediaType}/{mediaId}'
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
    url: '/watchlist/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\WatchlistController::store
 * @see app/Http/Controllers/WatchlistController.php:62
 * @route '/watchlist/{mediaType}/{mediaId}'
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
 * @see \App\Http\Controllers\WatchlistController::store
 * @see app/Http/Controllers/WatchlistController.php:62
 * @route '/watchlist/{mediaType}/{mediaId}'
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
 * @see \App\Http\Controllers\WatchlistController::store
 * @see app/Http/Controllers/WatchlistController.php:62
 * @route '/watchlist/{mediaType}/{mediaId}'
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
 * @see \App\Http\Controllers\WatchlistController::store
 * @see app/Http/Controllers/WatchlistController.php:62
 * @route '/watchlist/{mediaType}/{mediaId}'
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
 * @see \App\Http\Controllers\WatchlistController::destroy
 * @see app/Http/Controllers/WatchlistController.php:67
 * @route '/watchlist/{mediaType}/{mediaId}'
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
    url: '/watchlist/{mediaType}/{mediaId}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\WatchlistController::destroy
 * @see app/Http/Controllers/WatchlistController.php:67
 * @route '/watchlist/{mediaType}/{mediaId}'
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
 * @see \App\Http\Controllers\WatchlistController::destroy
 * @see app/Http/Controllers/WatchlistController.php:67
 * @route '/watchlist/{mediaType}/{mediaId}'
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
 * @see \App\Http\Controllers\WatchlistController::destroy
 * @see app/Http/Controllers/WatchlistController.php:67
 * @route '/watchlist/{mediaType}/{mediaId}'
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
 * @see \App\Http\Controllers\WatchlistController::destroy
 * @see app/Http/Controllers/WatchlistController.php:67
 * @route '/watchlist/{mediaType}/{mediaId}'
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

const WatchlistController = { index, show, store, destroy };

export default WatchlistController;
