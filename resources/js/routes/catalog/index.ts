import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
export const search = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
});

search.definition = {
    methods: ['get', 'head'],
    url: '/catalog/search',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
const searchForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
searchForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

search.form = searchForm;

const catalog = {
    search: Object.assign(search, search),
};

export default catalog;
