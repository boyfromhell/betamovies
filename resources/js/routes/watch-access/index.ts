import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\WatchVerificationController::create
 * @see app/Http/Controllers/WatchVerificationController.php:19
 * @route '/watch/verify'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/watch/verify',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\WatchVerificationController::create
 * @see app/Http/Controllers/WatchVerificationController.php:19
 * @route '/watch/verify'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\WatchVerificationController::create
 * @see app/Http/Controllers/WatchVerificationController.php:19
 * @route '/watch/verify'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchVerificationController::create
 * @see app/Http/Controllers/WatchVerificationController.php:19
 * @route '/watch/verify'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\WatchVerificationController::create
 * @see app/Http/Controllers/WatchVerificationController.php:19
 * @route '/watch/verify'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchVerificationController::create
 * @see app/Http/Controllers/WatchVerificationController.php:19
 * @route '/watch/verify'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\WatchVerificationController::create
 * @see app/Http/Controllers/WatchVerificationController.php:19
 * @route '/watch/verify'
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
 * @see \App\Http\Controllers\WatchVerificationController::store
 * @see app/Http/Controllers/WatchVerificationController.php:48
 * @route '/watch/verify'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/watch/verify',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\WatchVerificationController::store
 * @see app/Http/Controllers/WatchVerificationController.php:48
 * @route '/watch/verify'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\WatchVerificationController::store
 * @see app/Http/Controllers/WatchVerificationController.php:48
 * @route '/watch/verify'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\WatchVerificationController::store
 * @see app/Http/Controllers/WatchVerificationController.php:48
 * @route '/watch/verify'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\WatchVerificationController::store
 * @see app/Http/Controllers/WatchVerificationController.php:48
 * @route '/watch/verify'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

const watchAccess = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
};

export default watchAccess;
