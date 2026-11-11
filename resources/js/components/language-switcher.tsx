import { router } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { useId, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { update } from '@/routes/locale';

export function LanguageSwitcher() {
    const { locale, t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const id = useId();

    return (
        <div className="relative flex shrink-0 items-center">
            <Languages
                aria-hidden="true"
                className="pointer-events-none absolute left-2.5 size-4 text-slate-400"
            />
            <label htmlFor={id} className="sr-only">
                {t('Language')}
            </label>
            <select
                id={id}
                value={locale}
                disabled={processing}
                onChange={(event) => {
                    const selectedLocale = event.currentTarget.value;
                    if (selectedLocale === locale) {
                        return;
                    }

                    router.cancelAll();
                    router.flushAll();
                    router.post(
                        update.url(),
                        { locale: selectedLocale },
                        {
                            preserveScroll: true,
                            preserveState: false,
                            onStart: () => setProcessing(true),
                            onFinish: () => setProcessing(false),
                        },
                    );
                }}
                className="h-11 max-w-28 cursor-pointer rounded-lg border border-white/10 bg-[#0d1728] pr-2 pl-8 text-xs font-bold text-slate-200 transition hover:border-white/30 focus-visible:outline-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-60"
            >
                <option value="en" lang="en">
                    English
                </option>
                <option value="ro" lang="ro">
                    Română
                </option>
            </select>
        </div>
    );
}
