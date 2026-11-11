import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/contact',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
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

const contact = {
    index: Object.assign(index, index),
};

export default contact;
