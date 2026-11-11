import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
const ContactController = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: ContactController.url(options),
    method: 'get',
});

ContactController.definition = {
    methods: ['get', 'head'],
    url: '/contact',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
ContactController.url = (options?: RouteQueryOptions) => {
    return ContactController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
ContactController.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: ContactController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
ContactController.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: ContactController.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
const ContactControllerForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: ContactController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
ContactControllerForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: ContactController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::__invoke
 * @see app/Http/Controllers/ContactController.php:10
 * @route '/contact'
 */
ContactControllerForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: ContactController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery),
        },
    }),
    method: 'get',
});

ContactController.form = ContactControllerForm;

export default ContactController;
