import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
import movies from './movies';
/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/admin/tmdb/lists',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::store
 * @see app/Http/Controllers/Admin/TmdbController.php:114
 * @route '/admin/tmdb/lists'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clear
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
export const clear = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: clear.url(args, options),
    method: 'patch',
});

clear.definition = {
    methods: ['patch'],
    url: '/admin/tmdb/lists/{list}/clear',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clear
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
clear.url = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { list: args };
    }

    if (Array.isArray(args)) {
        args = {
            list: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
    };

    return (
        clear.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clear
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
clear.patch = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: clear.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clear
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
const clearForm = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: clear.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::clear
 * @see app/Http/Controllers/Admin/TmdbController.php:134
 * @route '/admin/tmdb/lists/{list}/clear'
 */
clearForm.patch = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: clear.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

clear.form = clearForm;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
export const destroy = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/admin/tmdb/lists/{list}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
destroy.url = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { list: args };
    }

    if (Array.isArray(args)) {
        args = {
            list: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        list: args.list,
    };

    return (
        destroy.definition.url
            .replace('{list}', parsedArgs.list.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
destroy.delete = (
    args: { list: string | number } | [list: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\TmdbController::destroy
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
const destroyForm = (
    args: { list: string | number } | [list: string | number] | string | number,
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
 * @see app/Http/Controllers/Admin/TmdbController.php:139
 * @route '/admin/tmdb/lists/{list}'
 */
destroyForm.delete = (
    args: { list: string | number } | [list: string | number] | string | number,
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

const lists = {
    store: Object.assign(store, store),
    movies: Object.assign(movies, movies),
    clear: Object.assign(clear, clear),
    destroy: Object.assign(destroy, destroy),
};

export default lists;
