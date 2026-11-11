import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\SeriesController::index
 * @see app/Http/Controllers/SeriesController.php:20
 * @route '/series'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/series',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SeriesController::index
 * @see app/Http/Controllers/SeriesController.php:20
 * @route '/series'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\SeriesController::index
 * @see app/Http/Controllers/SeriesController.php:20
 * @route '/series'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesController::index
 * @see app/Http/Controllers/SeriesController.php:20
 * @route '/series'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SeriesController::index
 * @see app/Http/Controllers/SeriesController.php:20
 * @route '/series'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesController::index
 * @see app/Http/Controllers/SeriesController.php:20
 * @route '/series'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesController::index
 * @see app/Http/Controllers/SeriesController.php:20
 * @route '/series'
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
 * @see \App\Http\Controllers\SeriesController::show
 * @see app/Http/Controllers/SeriesController.php:69
 * @route '/series/{series}'
 */
export const show = (
    args:
        | { series: string | number }
        | [series: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/series/{series}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SeriesController::show
 * @see app/Http/Controllers/SeriesController.php:69
 * @route '/series/{series}'
 */
show.url = (
    args:
        | { series: string | number }
        | [series: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { series: args };
    }

    if (Array.isArray(args)) {
        args = {
            series: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        series: args.series,
    };

    return (
        show.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SeriesController::show
 * @see app/Http/Controllers/SeriesController.php:69
 * @route '/series/{series}'
 */
show.get = (
    args:
        | { series: string | number }
        | [series: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesController::show
 * @see app/Http/Controllers/SeriesController.php:69
 * @route '/series/{series}'
 */
show.head = (
    args:
        | { series: string | number }
        | [series: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SeriesController::show
 * @see app/Http/Controllers/SeriesController.php:69
 * @route '/series/{series}'
 */
const showForm = (
    args:
        | { series: string | number }
        | [series: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesController::show
 * @see app/Http/Controllers/SeriesController.php:69
 * @route '/series/{series}'
 */
showForm.get = (
    args:
        | { series: string | number }
        | [series: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesController::show
 * @see app/Http/Controllers/SeriesController.php:69
 * @route '/series/{series}'
 */
showForm.head = (
    args:
        | { series: string | number }
        | [series: string | number]
        | string
        | number,
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

const SeriesController = { index, show };

export default SeriesController;
