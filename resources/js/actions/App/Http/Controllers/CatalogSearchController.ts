import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
const CatalogSearchController = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: CatalogSearchController.url(options),
    method: 'get',
});

CatalogSearchController.definition = {
    methods: ['get', 'head'],
    url: '/catalog/search',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
CatalogSearchController.url = (options?: RouteQueryOptions) => {
    return CatalogSearchController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
CatalogSearchController.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: CatalogSearchController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
CatalogSearchController.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: CatalogSearchController.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
const CatalogSearchControllerForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: CatalogSearchController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
CatalogSearchControllerForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: CatalogSearchController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CatalogSearchController::__invoke
 * @see app/Http/Controllers/CatalogSearchController.php:13
 * @route '/catalog/search'
 */
CatalogSearchControllerForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: CatalogSearchController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

CatalogSearchController.form = CatalogSearchControllerForm;

export default CatalogSearchController;
