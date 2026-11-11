import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../wayfinder';
/**
 * @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
});

home.definition = {
    methods: ['get', 'head'],
    url: '/',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/'
 */
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/'
 */
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:16
 * @route '/'
 */
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

home.form = homeForm;

/**
 * @see routes/web.php:28
 * @route '/robots.txt'
 */
export const robots = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: robots.url(options),
    method: 'get',
});

robots.definition = {
    methods: ['get', 'head'],
    url: '/robots.txt',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see routes/web.php:28
 * @route '/robots.txt'
 */
robots.url = (options?: RouteQueryOptions) => {
    return robots.definition.url + queryParams(options);
};

/**
 * @see routes/web.php:28
 * @route '/robots.txt'
 */
robots.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: robots.url(options),
    method: 'get',
});

/**
 * @see routes/web.php:28
 * @route '/robots.txt'
 */
robots.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: robots.url(options),
    method: 'head',
});

/**
 * @see routes/web.php:28
 * @route '/robots.txt'
 */
const robotsForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: robots.url(options),
    method: 'get',
});

/**
 * @see routes/web.php:28
 * @route '/robots.txt'
 */
robotsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: robots.url(options),
    method: 'get',
});

/**
 * @see routes/web.php:28
 * @route '/robots.txt'
 */
robotsForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: robots.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

robots.form = robotsForm;

/**
 * @see \App\Http\Controllers\SitemapController::__invoke
 * @see app/Http/Controllers/SitemapController.php:10
 * @route '/sitemap.xml'
 */
export const sitemap = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
});

sitemap.definition = {
    methods: ['get', 'head'],
    url: '/sitemap.xml',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SitemapController::__invoke
 * @see app/Http/Controllers/SitemapController.php:10
 * @route '/sitemap.xml'
 */
sitemap.url = (options?: RouteQueryOptions) => {
    return sitemap.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\SitemapController::__invoke
 * @see app/Http/Controllers/SitemapController.php:10
 * @route '/sitemap.xml'
 */
sitemap.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SitemapController::__invoke
 * @see app/Http/Controllers/SitemapController.php:10
 * @route '/sitemap.xml'
 */
sitemap.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sitemap.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SitemapController::__invoke
 * @see app/Http/Controllers/SitemapController.php:10
 * @route '/sitemap.xml'
 */
const sitemapForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: sitemap.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SitemapController::__invoke
 * @see app/Http/Controllers/SitemapController.php:10
 * @route '/sitemap.xml'
 */
sitemapForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: sitemap.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SitemapController::__invoke
 * @see app/Http/Controllers/SitemapController.php:10
 * @route '/sitemap.xml'
 */
sitemapForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: sitemap.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

sitemap.form = sitemapForm;
