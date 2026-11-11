import { useTranslation } from '@/hooks/use-translation';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SeoHead } from '@/components/seo-head';
import { home } from '@/routes';
import { store as verifyWatchAccess } from '@/routes/watch-access';

type Props = {
    siteKey: string;
    action: string;
    redirect: string;
};

type TurnstileOptions = {
    sitekey: string;
    action: string;
    theme: 'dark';
    size: 'flexible';
    language: 'en' | 'ro';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
};

type TurnstileApi = {
    render: (element: HTMLElement, options: TurnstileOptions) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

const scriptId = 'cloudflare-turnstile-script';

export default function WatchVerification({
    siteKey,
    action,
    redirect,
}: Props) {
    const { t, locale } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const resetWidget = () => {
            if (widgetIdRef.current !== null) {
                window.turnstile?.reset(widgetIdRef.current);
            }
        };

        const submitToken = (token: string) => {
            setError(null);
            setIsVerifying(true);

            router.post(
                verifyWatchAccess.url(),
                {
                    'cf-turnstile-response': token,
                    redirect,
                },
                {
                    preserveScroll: true,
                    onError: (errors) => {
                        setError(
                            errors.turnstile ??
                                t('Verification failed. Please try again.'),
                        );
                        resetWidget();
                    },
                    onFinish: () => setIsVerifying(false),
                },
            );
        };

        const renderWidget = () => {
            if (
                !isActive ||
                window.turnstile === undefined ||
                containerRef.current === null ||
                widgetIdRef.current !== null
            ) {
                return;
            }

            widgetIdRef.current = window.turnstile.render(
                containerRef.current,
                {
                    sitekey: siteKey,
                    action,
                    theme: 'dark',
                    size: 'flexible',
                    language: locale,
                    callback: submitToken,
                    'expired-callback': () => {
                        setError(t('Verification expired. Please try again.'));
                        resetWidget();
                    },
                    'error-callback': () => {
                        setError(
                            t(
                                'Cloudflare could not load the verification. Please try again.',
                            ),
                        );
                    },
                },
            );
        };

        const handleScriptError = () => {
            setError(
                t(
                    'Cloudflare could not load the verification. Please refresh the page.',
                ),
            );
        };

        let script = document.getElementById(
            scriptId,
        ) as HTMLScriptElement | null;

        if (window.turnstile !== undefined) {
            renderWidget();
        } else if (script === null) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src =
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.addEventListener('load', renderWidget, { once: true });
            script.addEventListener('error', handleScriptError, { once: true });
            document.head.appendChild(script);
        } else {
            script.addEventListener('load', renderWidget, { once: true });
            script.addEventListener('error', handleScriptError, { once: true });
        }

        return () => {
            isActive = false;
            script?.removeEventListener('load', renderWidget);
            script?.removeEventListener('error', handleScriptError);

            if (widgetIdRef.current !== null) {
                window.turnstile?.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [action, redirect, siteKey, locale, t]);

    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#070d1a] px-4 py-12 text-slate-100">
            <SeoHead title={t('Security check — Beta Movies')} />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,.14),transparent_42%)]" />
            <div className="pointer-events-none absolute top-[-12rem] left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-sky-500/8 blur-3xl" />

            <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1424]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-sky-300"
                    >
                        <ArrowLeft className="size-4" /> {t('Back to home')}
                    </Link>
                    <LanguageSwitcher />
                </div>

                <img
                    src="/icons/betamovies.png"
                    alt={t('Beta Movies')}
                    className="mt-8 h-auto w-52"
                />

                <div className="mx-auto mt-8 flex size-14 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
                    <ShieldCheck className="size-7" />
                </div>

                <h1 className="mt-5 text-2xl font-black tracking-tight">
                    {t('One quick security check')}{' '}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                    {t(
                        'Complete the Cloudflare verification to open the player. This helps us prevent automated abuse.',
                    )}{' '}
                </p>

                <div className="mt-7 min-h-[66px]">
                    <div ref={containerRef} className="w-full" />
                </div>

                {isVerifying && (
                    <p className="mt-4 flex items-center gap-2 text-sm font-bold text-sky-300">
                        <LoaderCircle className="size-4 animate-spin" />
                        {t('Opening player…')}{' '}
                    </p>
                )}

                {error !== null && (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
                    >
                        {error}
                    </p>
                )}

                {/* <div className="mt-7 flex items-center gap-2 border-t border-white/8 pt-5 text-xs text-slate-600">
                    <LockKeyhole className="size-3.5" />
                    Protected by Cloudflare Turnstile
                </div> */}
            </section>
        </main>
    );
}
