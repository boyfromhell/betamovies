import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
    validateParameters,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
const SeriesWatchController = (
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
    url: SeriesWatchController.url(args, options),
    method: 'get',
});

SeriesWatchController.definition = {
    methods: ['get', 'head'],
    url: '/series/{series}/{name}/watch/{season?}/{episode?}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
SeriesWatchController.url = (
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
        SeriesWatchController.definition.url
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
SeriesWatchController.get = (
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
    url: SeriesWatchController.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
SeriesWatchController.head = (
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
    url: SeriesWatchController.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
const SeriesWatchControllerForm = (
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
    action: SeriesWatchController.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
SeriesWatchControllerForm.get = (
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
    action: SeriesWatchController.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SeriesWatchController::__invoke
 * @see app/Http/Controllers/SeriesWatchController.php:16
 * @route '/series/{series}/{name}/watch/{season?}/{episode?}'
 */
SeriesWatchControllerForm.head = (
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
    action: SeriesWatchController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

SeriesWatchController.form = SeriesWatchControllerForm;

export default SeriesWatchController;
