import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
    validateParameters,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\PersonController::show
 * @see app/Http/Controllers/PersonController.php:17
 * @route '/people/{person}/{name?}'
 */
export const show = (
    args:
        | { person: string | number; name?: string | number }
        | [person: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/people/{person}/{name?}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PersonController::show
 * @see app/Http/Controllers/PersonController.php:17
 * @route '/people/{person}/{name?}'
 */
show.url = (
    args:
        | { person: string | number; name?: string | number }
        | [person: string | number, name: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            person: args[0],
            name: args[1],
        };
    }

    args = applyUrlDefaults(args);

    validateParameters(args, ['name']);

    const parsedArgs = {
        person: args.person,
        name: args.name,
    };

    return (
        show.definition.url
            .replace('{person}', parsedArgs.person.toString())
            .replace('{name?}', parsedArgs.name?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PersonController::show
 * @see app/Http/Controllers/PersonController.php:17
 * @route '/people/{person}/{name?}'
 */
show.get = (
    args:
        | { person: string | number; name?: string | number }
        | [person: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PersonController::show
 * @see app/Http/Controllers/PersonController.php:17
 * @route '/people/{person}/{name?}'
 */
show.head = (
    args:
        | { person: string | number; name?: string | number }
        | [person: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PersonController::show
 * @see app/Http/Controllers/PersonController.php:17
 * @route '/people/{person}/{name?}'
 */
const showForm = (
    args:
        | { person: string | number; name?: string | number }
        | [person: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PersonController::show
 * @see app/Http/Controllers/PersonController.php:17
 * @route '/people/{person}/{name?}'
 */
showForm.get = (
    args:
        | { person: string | number; name?: string | number }
        | [person: string | number, name: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PersonController::show
 * @see app/Http/Controllers/PersonController.php:17
 * @route '/people/{person}/{name?}'
 */
showForm.head = (
    args:
        | { person: string | number; name?: string | number }
        | [person: string | number, name: string | number],
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

const people = {
    show: Object.assign(show, show),
};

export default people;
