import { Link } from '@inertiajs/react';
import { ArrowUpRight, Mail, MessageSquare, ShieldCheck } from 'lucide-react';
import { CatalogHeader } from '@/components/catalog-header';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';
import { SeoHead } from '@/components/seo-head';
import { useTranslation } from '@/hooks/use-translation';
import { index as policyIndex } from '@/routes/policy';

type Props = {
    appName: string;
    contactEmail: string;
};

export default function Contact({ appName, contactEmail }: Props) {
    const { t } = useTranslation();
    const email = contactEmail.trim();
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(`${appName} — Contact`)}`;

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={`${t('Contact')} — ${appName}`} />
            <CatalogNavigation />
            <CatalogHeader />
            <main className="pb-28 lg:ml-64 lg:pb-12">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <header className="rounded-3xl border border-white/8 bg-white/[.025] p-6 sm:p-10">
                        <span className="grid size-12 place-items-center rounded-2xl bg-sky-500/15 text-sky-300">
                            <Mail className="size-6" aria-hidden="true" />
                        </span>
                        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                            {t('Contact')}
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                            {t(
                                'Questions, feedback or something that needs our attention? Send us an email.',
                            )}
                        </p>
                    </header>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <section className="min-w-0 rounded-3xl border border-sky-400/15 bg-sky-400/5 p-6 sm:p-8">
                            <h2 className="text-xl font-black text-white">
                                {t('Email us')}
                            </h2>
                            {email ? (
                                <a
                                    href={emailUrl}
                                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                                >
                                    <Mail
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    {t('Send an email')}
                                    <ArrowUpRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </a>
                            ) : (
                                <p className="mt-4 text-sm leading-7 text-slate-400">
                                    {t('Contact email is not available yet.')}
                                </p>
                            )}
                        </section>

                        <section className="rounded-3xl border border-white/8 bg-white/[.025] p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-black text-white">
                                <MessageSquare
                                    className="size-5 text-sky-300"
                                    aria-hidden="true"
                                />
                                {t('What to include')}
                            </h2>
                            <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-400 marker:text-sky-400">
                                <li>
                                    {t(
                                        'The page URL and the movie or TV show title.',
                                    )}
                                </li>
                                <li>
                                    {t(
                                        'A short description of the issue or request.',
                                    )}
                                </li>
                                <li>
                                    {t(
                                        'Your browser and device, if you are reporting a playback problem.',
                                    )}
                                </li>
                            </ul>
                        </section>
                    </div>

                    <section className="mt-5 rounded-3xl border border-white/8 bg-white/[.025] p-6 sm:p-8">
                        <h2 className="flex items-center gap-2 text-xl font-black text-white">
                            <ShieldCheck
                                className="size-5 text-sky-300"
                                aria-hidden="true"
                            />
                            {t('Copyright inquiries')}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-slate-400">
                            {t(
                                'For copyright-related requests, include the exact page URL and details of your request.',
                            )}
                        </p>
                        <Link
                            href={policyIndex()}
                            prefetch={['hover', 'click']}
                            cacheFor="1m"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                        >
                            {t('Read our Privacy & DMCA Policy')}
                            <ArrowUpRight
                                className="size-4"
                                aria-hidden="true"
                            />
                        </Link>
                    </section>
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
