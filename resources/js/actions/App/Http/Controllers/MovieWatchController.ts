import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\MovieWatchController::__invoke
 * @see app/Http/Controllers/MovieWatchController.php:16
 * @route '/movie/{movie}/{name}/watch'
 */
const MovieWatchController = (
    args:
        | { movie: string | number; name: string | number }
        | [movie: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: MovieWatchController.url(args, options),
    method: 'get',
});

MovieWatchController.definition = {
    methods: ['get', 'head'],
    url: '/movie/{movie}/{name}/watch',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\MovieWatchController::__invoke
 * @see app/Http/Controllers/MovieWatchController.php:16
 * @route '/movie/{movie}/{name}/watch'
 */
MovieWatchController.url = (
    args:
        | { movie: string | number; name: string | number }
        | [movie: string | number, name: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            movie: args[0],
            name: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        movie: args.movie,
        name: args.name,
    };

    return (
        MovieWatchController.definition.url
            .replace('{movie}', parsedArgs.movie.toString())
            .replace('{name}', parsedArgs.name.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\MovieWatchController::__invoke
 * @see app/Http/Controllers/MovieWatchController.php:16
 * @route '/movie/{movie}/{name}/watch'
 */
MovieWatchController.get = (
    args:
        | { movie: string | number; name: string | number }
        | [movie: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: MovieWatchController.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MovieWatchController::__invoke
 * @see app/Http/Controllers/MovieWatchController.php:16
 * @route '/movie/{movie}/{name}/watch'
 */
MovieWatchController.head = (
    args:
        | { movie: string | number; name: string | number }
        | [movie: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: MovieWatchController.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\MovieWatchController::__invoke
 * @see app/Http/Controllers/MovieWatchController.php:16
 * @route '/movie/{movie}/{name}/watch'
 */
const MovieWatchControllerForm = (
    args:
        | { movie: string | number; name: string | number }
        | [movie: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: MovieWatchController.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MovieWatchController::__invoke
 * @see app/Http/Controllers/MovieWatchController.php:16
 * @route '/movie/{movie}/{name}/watch'
 */
MovieWatchControllerForm.get = (
    args:
        | { movie: string | number; name: string | number }
        | [movie: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: MovieWatchController.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MovieWatchController::__invoke
 * @see app/Http/Controllers/MovieWatchController.php:16
 * @route '/movie/{movie}/{name}/watch'
 */
MovieWatchControllerForm.head = (
    args:
        | { movie: string | number; name: string | number }
        | [movie: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: MovieWatchController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

MovieWatchController.form = MovieWatchControllerForm;

export default MovieWatchController;
