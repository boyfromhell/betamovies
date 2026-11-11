import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\LogController::index
 * @see app/Http/Controllers/Admin/LogController.php:13
 * @route '/admin/logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/admin/logs',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\LogController::index
 * @see app/Http/Controllers/Admin/LogController.php:13
 * @route '/admin/logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\LogController::index
 * @see app/Http/Controllers/Admin/LogController.php:13
 * @route '/admin/logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\LogController::index
 * @see app/Http/Controllers/Admin/LogController.php:13
 * @route '/admin/logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\LogController::index
 * @see app/Http/Controllers/Admin/LogController.php:13
 * @route '/admin/logs'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\LogController::index
 * @see app/Http/Controllers/Admin/LogController.php:13
 * @route '/admin/logs'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\LogController::index
 * @see app/Http/Controllers/Admin/LogController.php:13
 * @route '/admin/logs'
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
 * @see \App\Http\Controllers\Admin\LogController::clear
 * @see app/Http/Controllers/Admin/LogController.php:34
 * @route '/admin/logs/{filename}/clear'
 */
export const clear = (
    args:
        | { filename: string | number }
        | [filename: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: clear.url(args, options),
    method: 'patch',
});

clear.definition = {
    methods: ['patch'],
    url: '/admin/logs/{filename}/clear',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\Admin\LogController::clear
 * @see app/Http/Controllers/Admin/LogController.php:34
 * @route '/admin/logs/{filename}/clear'
 */
clear.url = (
    args:
        | { filename: string | number }
        | [filename: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { filename: args };
    }

    if (Array.isArray(args)) {
        args = {
            filename: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        filename: args.filename,
    };

    return (
        clear.definition.url
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\LogController::clear
 * @see app/Http/Controllers/Admin/LogController.php:34
 * @route '/admin/logs/{filename}/clear'
 */
clear.patch = (
    args:
        | { filename: string | number }
        | [filename: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: clear.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\Admin\LogController::clear
 * @see app/Http/Controllers/Admin/LogController.php:34
 * @route '/admin/logs/{filename}/clear'
 */
const clearForm = (
    args:
        | { filename: string | number }
        | [filename: string | number]
        | string
        | number,
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
 * @see \App\Http\Controllers\Admin\LogController::clear
 * @see app/Http/Controllers/Admin/LogController.php:34
 * @route '/admin/logs/{filename}/clear'
 */
clearForm.patch = (
    args:
        | { filename: string | number }
        | [filename: string | number]
        | string
        | number,
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

const logs = {
    index: Object.assign(index, index),
    clear: Object.assign(clear, clear),
};

export default logs;
