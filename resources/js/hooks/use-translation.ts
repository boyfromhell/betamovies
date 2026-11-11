import { usePage } from '@inertiajs/react';
import { useCallback, useEffect } from 'react';
import { translate, type Locale, type TranslationParameters } from '@/lib/i18n';

export function useTranslation() {
    const { locale: preferredLocale } = usePage().props;
    const locale: Locale = preferredLocale === 'ro' ? 'ro' : 'en';

    useEffect(() => {
        if (document.documentElement.lang !== locale) {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const t = useCallback(
        (message: string, parameters?: TranslationParameters) =>
            translate(locale, message, parameters),
        [locale],
    );

    return { t, locale, localeTag: locale === 'ro' ? 'ro-RO' : 'en-US' };
}
