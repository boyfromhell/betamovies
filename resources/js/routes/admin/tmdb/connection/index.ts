import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::create
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:16
 * @route '/admin/tmdb/connect'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/admin/tmdb/connect',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::create
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:16
 * @route '/admin/tmdb/connect'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::create
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:16
 * @route '/admin/tmdb/connect'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::create
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:16
 * @route '/admin/tmdb/connect'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::create
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:16
 * @route '/admin/tmdb/connect'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::create
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:16
 * @route '/admin/tmdb/connect'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::create
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:16
 * @route '/admin/tmdb/connect'
 */
createForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

create.form = createForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::callback
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:40
 * @route '/admin/tmdb/callback'
 */
export const callback = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
});

callback.definition = {
    methods: ['get', 'head'],
    url: '/admin/tmdb/callback',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::callback
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:40
 * @route '/admin/tmdb/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::callback
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:40
 * @route '/admin/tmdb/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::callback
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:40
 * @route '/admin/tmdb/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::callback
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:40
 * @route '/admin/tmdb/callback'
 */
const callbackForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::callback
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:40
 * @route '/admin/tmdb/callback'
 */
callbackForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::callback
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:40
 * @route '/admin/tmdb/callback'
 */
callbackForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: callback.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

callback.form = callbackForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::destroy
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:101
 * @route '/admin/tmdb/connect'
 */
export const destroy = (
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/connect',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::destroy
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:101
 * @route '/admin/tmdb/connect'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::destroy
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:101
 * @route '/admin/tmdb/connect'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::destroy
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:101
 * @route '/admin/tmdb/connect'
 */
const destroyForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbConnectionController::destroy
 * @see app/Http/Controllers/Admin/TmdbConnectionController.php:101
 * @route '/admin/tmdb/connect'
 */
destroyForm.delete = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;

const connection = {
    create: Object.assign(create, create),
    callback: Object.assign(callback, callback),
    destroy: Object.assign(destroy, destroy),
};

export default connection;
