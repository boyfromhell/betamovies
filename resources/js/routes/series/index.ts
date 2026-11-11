import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
    validateParameters,
} from './../../wayfinder';
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

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
export const watch = (
    args:
        | {
              series: string | number;
              name: string | number;
              season?: string | number;
              episode?: string | number;
          }
        | [
              series: string | number,
              name: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: watch.url(args, options),
    method: 'get',
});

watch.definition = {
    methods: ['get', 'head'],
    url: '/series/{series}/{name}/watch/{season?}/{episode?}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
watch.url = (
    args:
        | {
              series: string | number;
              name: string | number;
              season?: string | number;
              episode?: string | number;
          }
        | [
              series: string | number,
              name: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            series: args[0],
            name: args[1],
            season: args[2],
            episode: args[3],
        };
    }

    args = applyUrlDefaults(args);

    validateParameters(args, ['season', 'episode']);

    const parsedArgs = {
        series: args.series,
        name: args.name,
        season: args.season,
        episode: args.episode,
    };

    return (
        watch.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace('{name}', parsedArgs.name.toString())
            .replace('{season?}', parsedArgs.season?.toString() ?? '')
            .replace('{episode?}', parsedArgs.episode?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
watch.get = (
    args:
        | {
              series: string | number;
              name: string | number;
              season?: string | number;
              episode?: string | number;
          }
        | [
              series: string | number,
              name: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: watch.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
watch.head = (
    args:
        | {
              series: string | number;
              name: string | number;
              season?: string | number;
              episode?: string | number;
          }
        | [
              series: string | number,
              name: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: watch.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
const watchForm = (
    args:
        | {
              series: string | number;
              name: string | number;
              season?: string | number;
              episode?: string | number;
          }
        | [
              series: string | number,
              name: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: watch.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
watchForm.get = (
    args:
        | {
              series: string | number;
              name: string | number;
              season?: string | number;
              episode?: string | number;
          }
        | [
              series: string | number,
              name: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: watch.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
watchForm.head = (
    args:
        | {
              series: string | number;
              name: string | number;
              season?: string | number;
              episode?: string | number;
          }
        | [
              series: string | number,
              name: string | number,
              season: string | number,
              episode: string | number,
          ],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: watch.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

watch.form = watchForm;

const series = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    watch: Object.assign(watch, watch),
};

export default series;
