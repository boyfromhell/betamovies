import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::index
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:16
 * @route '/admin/player-servers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/admin/player-servers',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::index
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:16
 * @route '/admin/player-servers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::index
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:16
 * @route '/admin/player-servers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::index
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:16
 * @route '/admin/player-servers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::index
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:16
 * @route '/admin/player-servers'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::index
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:16
 * @route '/admin/player-servers'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::index
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:16
 * @route '/admin/player-servers'
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
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::store
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:40
 * @route '/admin/player-servers'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/admin/player-servers',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::store
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:40
 * @route '/admin/player-servers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::store
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:40
 * @route '/admin/player-servers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::store
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:40
 * @route '/admin/player-servers'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::store
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:40
 * @route '/admin/player-servers'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::update
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:54
 * @route '/admin/player-servers/{videoPlayerServer}'
 */
export const update = (
    args:
        | { videoPlayerServer: number | { id: number } }
        | [videoPlayerServer: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

update.definition = {
    methods: ['patch'],
    url: '/admin/player-servers/{videoPlayerServer}',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::update
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:54
 * @route '/admin/player-servers/{videoPlayerServer}'
 */
update.url = (
    args:
        | { videoPlayerServer: number | { id: number } }
        | [videoPlayerServer: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { videoPlayerServer: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { videoPlayerServer: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            videoPlayerServer: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        videoPlayerServer:
            typeof args.videoPlayerServer === 'object'
                ? args.videoPlayerServer.id
                : args.videoPlayerServer,
    };

    return (
        update.definition.url
            .replace(
                '{videoPlayerServer}',
                parsedArgs.videoPlayerServer.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::update
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:54
 * @route '/admin/player-servers/{videoPlayerServer}'
 */
update.patch = (
    args:
        | { videoPlayerServer: number | { id: number } }
        | [videoPlayerServer: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::update
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:54
 * @route '/admin/player-servers/{videoPlayerServer}'
 */
const updateForm = (
    args:
        | { videoPlayerServer: number | { id: number } }
        | [videoPlayerServer: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\VideoPlayerServerController::update
 * @see app/Http/Controllers/Admin/VideoPlayerServerController.php:54
 * @route '/admin/player-servers/{videoPlayerServer}'
 */
updateForm.patch = (
    args:
        | { videoPlayerServer: number | { id: number } }
        | [videoPlayerServer: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'post',
});

update.form = updateForm;

const playerServers = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
};

export default playerServers;
