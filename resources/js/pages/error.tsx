import { useTranslation } from '@/hooks/use-translation';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Film, Tv } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { home } from '@/routes';
import { index as moviesIndex } from '@/routes/movies';
import { index as seriesIndex } from '@/routes/series';

type ErrorContent = {
    title: string;
    heading: string;
    message: string;
    scene: string;
};

const errors: Record<number, ErrorContent> = {
    401: {
        title: 'Authentication required',
        heading: 'This scene needs an invitation.',
        message:
            'You need to be signed in to open this page. Return home and sign in to continue.',
        scene: 'SIGN IN REQUIRED',
    },
    403: {
        title: 'Access denied',
        heading: 'This one is behind the scenes.',
        message:
            'You do not have permission to open this page. There is still plenty to explore in the catalog.',
        scene: 'ACCESS RESTRICTED',
    },
    404: {
        title: 'Page not found',
        heading: 'This scene is missing.',
        message:
            'The page you are looking for may have moved, been removed, or never made the final cut.',
        scene: 'SCENE NOT FOUND',
    },
    405: {
        title: 'Method not allowed',
        heading: 'A different way in.',
        message:
            'This page cannot be opened with that request. Head back to the catalog and start again.',
        scene: 'REQUEST NOT ALLOWED',
    },
    408: {
        title: 'Request timed out',
        heading: 'That scene took too long.',
        message:
            'The request timed out before it could finish. Please try again in a moment.',
        scene: 'REQUEST TIMED OUT',
    },
    410: {
        title: 'Page no longer available',
        heading: 'This scene has left the screen.',
        message:
            'This page is no longer available. Find your next movie or TV show in the catalog.',
        scene: 'NO LONGER AVAILABLE',
    },
    419: {
        title: 'Session expired',
        heading: 'Time for a fresh start.',
        message:
            'Your session has expired. Return home, then try your action again. Your last request was not repeated.',
        scene: 'SESSION EXPIRED',
    },
    422: {
        title: 'Request could not be processed',
        heading: 'Something did not fit the script.',
        message:
            'We could not process that request. Return to the previous page and check the information you entered.',
        scene: 'INVALID REQUEST',
    },
    429: {
        title: 'Too many requests',
        heading: 'A little pause between scenes.',
        message:
            'You have made too many requests in a short time. Please wait a moment before trying again.',
        scene: 'PLEASE SLOW DOWN',
    },
    500: {
        title: 'Server error',
        heading: 'An unexpected plot twist.',
        message: 'Something went wrong on our side. Please try again later.',
        scene: 'SOMETHING WENT WRONG',
    },
    502: {
        title: 'Bad gateway',
        heading: 'The connection missed its cue.',
        message:
            'An upstream service did not respond correctly. Please try again in a moment.',
        scene: 'CONNECTION INTERRUPTED',
    },
    503: {
        title: 'Service unavailable',
        heading: 'A brief intermission.',
        message:
            'Beta Movies is temporarily unavailable. Please check back shortly.',
        scene: 'BACK IN A MOMENT',
    },
    504: {
        title: 'Gateway timed out',
        heading: 'Still waiting for the next scene.',
        message:
            'An upstream service took too long to respond. Please try again later.',
        scene: 'CONNECTION TIMED OUT',
    },
};

export default function ErrorPage({ status }: { status: number }) {
    const { t } = useTranslation();
    const content = errors[status] ?? {
        title: 'Something went wrong',
        heading: 'An unexpected plot twist.',
        message: 'We could not open this page. Return home or try again later.',
        scene: 'SCENE UNAVAILABLE',
    };

    return (
        <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#070d1a] text-slate-100 selection:bg-sky-400/30">
            <Head title={`${status} — ${t(content.title)} — Beta Movies`}>
                <meta
                    head-key="robots"
                    name="robots"
                    content="noindex, nofollow"
                />
            </Head>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_40%,rgba(14,165,233,.08),transparent_55%)]"
            />

            <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-white/8 px-6 py-6 sm:px-10 sm:py-8">
                <Link
                    href={home()}
                    aria-label={t('Beta Movies, home')}
                    className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-sky-400"
                >
                    <img
                        src="/icons/betamovies.png"
                        alt={t('Beta Movies')}
                        className="h-auto w-40 sm:w-48"
                    />
                </Link>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link
                        href={home()}
                        className="flex min-h-11 items-center gap-2 rounded-lg text-xs font-bold text-slate-400 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 sm:text-sm"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        {t('Home')}
                    </Link>
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-6 py-10 sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
                <section className="order-2 flex flex-col items-start gap-6 lg:order-1">
                    <p className="flex items-center gap-2.5 text-[10px] font-black tracking-[.24em] text-sky-400 sm:text-xs">
                        <span
                            aria-hidden="true"
                            className="h-px w-7 bg-sky-400"
                        />
                        {t(content.title).toUpperCase()}
                    </p>

                    <h1 className="max-w-lg text-4xl leading-[1.08] font-black tracking-tight text-white sm:text-5xl xl:text-6xl">
                        {t(content.heading)}
                    </h1>
                    <p className="max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                        {t(content.message)}
                    </p>

                    <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
                        <Link
                            href={home()}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 text-sm font-extrabold text-white transition hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            {t('Back to home')}{' '}
                        </Link>
                        <Link
                            href={moviesIndex()}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[.025] px-6 text-sm font-bold text-slate-200 transition hover:border-white/25 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                        >
                            {t('Browse movies')}{' '}
                            <ArrowUpRight
                                aria-hidden="true"
                                className="size-4 text-slate-500"
                            />
                        </Link>
                    </div>
                </section>

                <div
                    aria-hidden="true"
                    className="relative order-1 flex min-h-56 items-center justify-center rounded-3xl border border-white/8 bg-[#08101f] px-5 py-10 shadow-2xl shadow-black/20 sm:min-h-72 lg:order-2 lg:aspect-[5/4]"
                >
                    <div className="absolute inset-3 rounded-2xl border border-white/[.035] sm:inset-5" />
                    <div className="absolute top-7 left-7 flex items-center gap-2 text-[9px] font-bold tracking-[.22em] text-slate-600 sm:top-10 sm:left-10">
                        <Film className="size-3.5" />
                        {t('BETA MOVIES')}{' '}
                    </div>
                    <div className="relative flex flex-col items-center gap-1 sm:gap-3">
                        <span className="bg-linear-to-b from-slate-300 via-slate-500 to-slate-700 bg-clip-text text-[7rem] leading-none font-black tracking-[-.08em] text-transparent sm:text-[10rem] xl:text-[12rem]">
                            {status}
                        </span>
                        <span className="text-[9px] font-bold tracking-[.28em] text-sky-400/80 sm:text-[10px]">
                            {t(content.scene)}
                        </span>
                    </div>
                    <div className="absolute right-7 bottom-7 left-7 flex items-center gap-3 sm:right-10 sm:bottom-10 sm:left-10">
                        <span className="size-1.5 rounded-full bg-sky-400/80" />
                        <span className="h-px flex-1 bg-white/8" />
                        <span className="text-[9px] font-bold tracking-[.12em] text-slate-600">
                            {t('END OF SCENE')}{' '}
                        </span>
                    </div>
                </div>
            </main>

            <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/8 px-6 py-6 text-xs text-slate-500 sm:px-10">
                <p>{t('There is always another story to discover.')}</p>
                <nav
                    aria-label={t('Explore the catalog')}
                    className="flex gap-6"
                >
                    <Link
                        href={moviesIndex()}
                        className="inline-flex min-h-10 items-center gap-2 rounded transition hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                    >
                        <Film aria-hidden="true" className="size-3.5" />
                        {t('Movies')}{' '}
                    </Link>
                    <Link
                        href={seriesIndex()}
                        className="inline-flex min-h-10 items-center gap-2 rounded transition hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                    >
                        <Tv aria-hidden="true" className="size-3.5" />
                        {t('TV Shows')}{' '}
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
