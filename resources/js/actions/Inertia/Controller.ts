import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/history'
 */
const Controller76b866564edf0e9c89b35d4d68fd8ded = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: Controller76b866564edf0e9c89b35d4d68fd8ded.url(options),
    method: 'get',
});

Controller76b866564edf0e9c89b35d4d68fd8ded.definition = {
    methods: ['get', 'head'],
    url: '/history',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/history'
 */
Controller76b866564edf0e9c89b35d4d68fd8ded.url = (
    options?: RouteQueryOptions,
) => {
    return (
        Controller76b866564edf0e9c89b35d4d68fd8ded.definition.url +
        queryParams(options)
    );
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/history'
 */
Controller76b866564edf0e9c89b35d4d68fd8ded.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: Controller76b866564edf0e9c89b35d4d68fd8ded.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/history'
 */
Controller76b866564edf0e9c89b35d4d68fd8ded.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: Controller76b866564edf0e9c89b35d4d68fd8ded.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/history'
 */
const Controller76b866564edf0e9c89b35d4d68fd8dedForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller76b866564edf0e9c89b35d4d68fd8ded.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/history'
 */
Controller76b866564edf0e9c89b35d4d68fd8dedForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller76b866564edf0e9c89b35d4d68fd8ded.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/history'
 */
Controller76b866564edf0e9c89b35d4d68fd8dedForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller76b866564edf0e9c89b35d4d68fd8ded.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

Controller76b866564edf0e9c89b35d4d68fd8ded.form =
    Controller76b866564edf0e9c89b35d4d68fd8dedForm;
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/policy'
 */
const Controller27898d97a1ef428c8c1af760516b4346 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: Controller27898d97a1ef428c8c1af760516b4346.url(options),
    method: 'get',
});

Controller27898d97a1ef428c8c1af760516b4346.definition = {
    methods: ['get', 'head'],
    url: '/policy',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/policy'
 */
Controller27898d97a1ef428c8c1af760516b4346.url = (
    options?: RouteQueryOptions,
) => {
    return (
        Controller27898d97a1ef428c8c1af760516b4346.definition.url +
        queryParams(options)
    );
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/policy'
 */
Controller27898d97a1ef428c8c1af760516b4346.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: Controller27898d97a1ef428c8c1af760516b4346.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/policy'
 */
Controller27898d97a1ef428c8c1af760516b4346.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: Controller27898d97a1ef428c8c1af760516b4346.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/policy'
 */
const Controller27898d97a1ef428c8c1af760516b4346Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller27898d97a1ef428c8c1af760516b4346.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/policy'
 */
Controller27898d97a1ef428c8c1af760516b4346Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller27898d97a1ef428c8c1af760516b4346.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/policy'
 */
Controller27898d97a1ef428c8c1af760516b4346Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller27898d97a1ef428c8c1af760516b4346.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

Controller27898d97a1ef428c8c1af760516b4346.form =
    Controller27898d97a1ef428c8c1af760516b4346Form;
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms'
 */
const Controller619dc3a99425f668ea9cab64e6648cb4 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: Controller619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'get',
});

Controller619dc3a99425f668ea9cab64e6648cb4.definition = {
    methods: ['get', 'head'],
    url: '/terms',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms'
 */
Controller619dc3a99425f668ea9cab64e6648cb4.url = (
    options?: RouteQueryOptions,
) => {
    return (
        Controller619dc3a99425f668ea9cab64e6648cb4.definition.url +
        queryParams(options)
    );
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms'
 */
Controller619dc3a99425f668ea9cab64e6648cb4.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: Controller619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms'
 */
Controller619dc3a99425f668ea9cab64e6648cb4.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: Controller619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms'
 */
const Controller619dc3a99425f668ea9cab64e6648cb4Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms'
 */
Controller619dc3a99425f668ea9cab64e6648cb4Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller619dc3a99425f668ea9cab64e6648cb4.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms'
 */
Controller619dc3a99425f668ea9cab64e6648cb4Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: Controller619dc3a99425f668ea9cab64e6648cb4.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

Controller619dc3a99425f668ea9cab64e6648cb4.form =
    Controller619dc3a99425f668ea9cab64e6648cb4Form;

/**
 * Multiple routes resolve to \Inertia\Controller::Controller, so this export is a
 * dictionary keyed by URI rather than a callable, with the verbs prefixed where two routes share a URI.
 * Call a specific route with `Controller['<key>'](...)`, or import the route by name from your
 * generated `routes/` directory.
 */
const Controller = {
    '/history': Controller76b866564edf0e9c89b35d4d68fd8ded,
    '/policy': Controller27898d97a1ef428c8c1af760516b4346,
    '/terms': Controller619dc3a99425f668ea9cab64e6648cb4,
};

export default Controller;
