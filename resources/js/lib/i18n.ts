import admin from '../../lang/admin/ro.json';
import catalog from '../../lang/catalog/ro.json';
import common from '../../lang/common/ro.json';
import pages from '../../lang/pages/ro.json';
import server from '../../lang/server/ro.json';

export type Locale = 'en' | 'ro';
export type TranslationParameters = Record<string, string | number>;

const romanian: Record<string, string> = {
    ...admin,
    ...catalog,
    ...common,
    ...pages,
    ...server,
};

export function translate(
    locale: Locale,
    message: string,
    parameters: TranslationParameters = {},
): string {
    const translated =
        locale === 'ro' ? (romanian[message] ?? message) : message;

    return translated.replace(
        /:([a-zA-Z][a-zA-Z0-9_]*)/g,
        (placeholder, key: string) =>
            Object.prototype.hasOwnProperty.call(parameters, key)
                ? String(parameters[key])
                : placeholder,
    );
}
