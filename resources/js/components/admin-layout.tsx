import { useTranslation } from '@/hooks/use-translation';
import { Form, Link } from '@inertiajs/react';
import {
    Bookmark,
    Database,
    ScrollText,
    Server,
    ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { CatalogHeader } from '@/components/catalog-header';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';
import { index as logsIndex } from '@/routes/admin/logs';
import { index as playerServersIndex } from '@/routes/admin/player-servers';
import { index as tmdbIndex } from '@/routes/admin/tmdb';
import { index as watchProtectionIndex } from '@/routes/admin/watch-protection';
import { index as watchlistIndex } from '@/routes/admin/watchlist';

type AdminPage =
    | 'watchlist'
    | 'tmdb'
    | 'player-servers'
    | 'watch-protection'
    | 'logs';

const links = [
    {
        page: 'watchlist',
        label: 'Watchlist',
        icon: Bookmark,
        href: watchlistIndex(),
    },
    { page: 'tmdb', label: 'TMDB account', icon: Database, href: tmdbIndex() },
    {
        page: 'player-servers',
        label: 'Player servers',
        icon: Server,
        href: playerServersIndex(),
    },
    {
        page: 'watch-protection',
        label: 'Watch protection',
        icon: ShieldCheck,
        href: watchProtectionIndex(),
    },
    { page: 'logs', label: 'Logs', icon: ScrollText, href: logsIndex() },
] satisfies Array<{
    page: AdminPage;
    label: string;
    icon: typeof Bookmark;
    href: ReturnType<typeof watchlistIndex>;
}>;

export function AdminLayout({
    active,
    children,
}: {
    active: AdminPage;
    children: ReactNode;
}) {
    const { t, localeTag } = useTranslation();
    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <CatalogNavigation active="admin" />
            <CatalogHeader />
            <main className="pb-28 lg:ml-64 lg:pb-10">
                <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <header>
                        <p className="text-[11px] font-black tracking-[.28em] text-sky-400">
                            BETA MOVIES
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                            {t('Admin')}{' '}
                        </h1>
                        <Form
                            action="/admin/logout"
                            method="post"
                            className="mt-4"
                        >
                            <button className="cursor-pointer text-sm font-bold text-slate-400 hover:text-white">
                                {t('Sign out')}
                            </button>
                        </Form>
                        <p className="mt-3 text-slate-400">
                            {t(
                                'Manage the TMDB account, player servers, watch protection and application logs.',
                            )}{' '}
                        </p>
                    </header>
                    <nav
                        className="mt-8 flex flex-wrap gap-2"
                        aria-label={t('Admin navigation')}
                    >
                        {links.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.page}
                                    href={item.href}
                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${active === item.page ? 'bg-sky-500 text-white' : 'border border-white/10 bg-white/[.03] text-slate-400 hover:text-white'}`}
                                >
                                    <Icon className="size-4" /> {t(item.label)}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-8">{children}</div>
                    <footer className="mt-8 border-t border-white/8 pt-5 text-xs text-slate-500">
                        <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2">
                                <dt>{t('Version')}</dt>
                                <dd className="font-mono font-semibold text-slate-300">
                                    {__APP_BUILD__.version ?? t('Unavailable')}
                                </dd>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <dt>{t('Build date')}</dt>
                                <dd className="text-slate-400">
                                    <time dateTime={__APP_BUILD__.builtAt}>
                                        {new Intl.DateTimeFormat(localeTag, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(
                                            new Date(__APP_BUILD__.builtAt),
                                        )}
                                    </time>
                                </dd>
                            </div>
                        </dl>
                    </footer>
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
