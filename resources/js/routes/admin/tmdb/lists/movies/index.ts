import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
export const store = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/admin/tmdb/lists/{list}/movies/{movie}',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
store.url = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            list: args[0],
            movie: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
        movie: args.movie,
    };

    return (
        store.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace('{movie}', parsedArgs.movie.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
store.post = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
const storeForm = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:124
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
storeForm.post = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
export const destroy = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/lists/{list}/movies/{movie}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
destroy.url = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            list: args[0],
            movie: args[1],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
        movie: args.movie,
    };

    return (
        destroy.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace('{movie}', parsedArgs.movie.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
destroy.delete = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
const destroyForm = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:129
 * @route '/admin/tmdb/lists/{list}/movies/{movie}'
 */
destroyForm.delete = (
    args:
        | { list: string | number; movie: string | number }
        | [list: string | number, movie: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;

const movies = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
};

export default movies;
