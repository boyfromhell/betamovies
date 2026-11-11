import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::index
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:14
 * @route '/admin/watch-protection'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/admin/watch-protection',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::index
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:14
 * @route '/admin/watch-protection'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::index
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:14
 * @route '/admin/watch-protection'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::index
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:14
 * @route '/admin/watch-protection'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::index
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:14
 * @route '/admin/watch-protection'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::index
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:14
 * @route '/admin/watch-protection'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::index
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:14
 * @route '/admin/watch-protection'
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
 * @see \App\Http\Controllers\Admin\WatchProtectionController::update
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:21
 * @route '/admin/watch-protection'
 */
export const update = (
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
});

update.definition = {
    methods: ['patch'],
    url: '/admin/watch-protection',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::update
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:21
 * @route '/admin/watch-protection'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::update
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:21
 * @route '/admin/watch-protection'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::update
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:21
 * @route '/admin/watch-protection'
 */
const updateForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\WatchProtectionController::update
 * @see app/Http/Controllers/Admin/WatchProtectionController.php:21
 * @route '/admin/watch-protection'
 */
updateForm.patch = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

update.form = updateForm;

const WatchProtectionController = { index, update };

export default WatchProtectionController;
