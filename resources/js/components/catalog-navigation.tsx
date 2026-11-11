import { Link, usePage } from '@inertiajs/react';
import { Bookmark, Clock3, Film, Home, Shield, Tv } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { index as adminWatchlistIndex } from '@/routes/admin/watchlist';
import { home } from '@/routes';
import { index as contactIndex } from '@/routes/contact';
import { index as historyIndex } from '@/routes/history';
import { index as moviesIndex } from '@/routes/movies';
import { index as policyIndex } from '@/routes/policy';
import { index as seriesIndex } from '@/routes/series';
import { index as termsIndex } from '@/routes/terms';
import { index as watchlistIndex } from '@/routes/watchlist';

export type CatalogPage =
    | 'acasa'
    | 'filme'
    | 'seriale'
    | 'istoric'
    | 'watchlist'
    | 'admin';

type NavigationEntry = {
    page: CatalogPage;
    label: string;
    icon: typeof Home;
    href: ReturnType<typeof home>;
};

const navigation = [
    { page: 'acasa', label: 'Home', icon: Home, href: home() },
    { page: 'filme', label: 'Movies', icon: Film, href: moviesIndex() },
    { page: 'seriale', label: 'TV Shows', icon: Tv, href: seriesIndex() },
    {
        page: 'istoric',
        label: 'History',
        icon: Clock3,
        href: historyIndex(),
    },
    {
        page: 'watchlist',
        label: 'Watchlist',
        icon: Bookmark,
        href: watchlistIndex(),
    },
] satisfies NavigationEntry[];

const adminNavigation = {
    page: 'admin',
    label: 'Admin',
    icon: Shield,
    href: adminWatchlistIndex(),
} satisfies NavigationEntry;

type Props = {
    active?: CatalogPage;
    onNavigate?: (page: CatalogPage) => void;
};

function NavigationItem({
    item,
    active,
    mobile,
    onNavigate,
}: {
    item: NavigationEntry;
    active: boolean;
    mobile: boolean;
    onNavigate?: Props['onNavigate'];
}) {
    const { t } = useTranslation();
    const Icon = item.icon;
    const className = mobile
        ? `flex min-w-0 flex-col items-center gap-1 py-2 text-[9px] font-bold transition sm:text-[10px] ${active ? 'text-sky-400' : 'text-slate-500'}`
        : `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/25' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`;
    const content = (
        <>
            <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 1.7} />
            <span className={mobile ? 'max-w-full truncate' : undefined}>
                {t(item.label)}
            </span>
        </>
    );

    return onNavigate ? (
        <button
            type="button"
            onClick={() => onNavigate(item.page)}
            className={className}
            aria-current={active ? 'page' : undefined}
            aria-label={t(item.label)}
        >
            {content}
        </button>
    ) : (
        <Link
            href={item.href}
            className={className}
            aria-current={active ? 'page' : undefined}
            aria-label={t(item.label)}
            prefetch={
                !active &&
                (item.page === 'acasa' ||
                    item.page === 'filme' ||
                    item.page === 'seriale')
                    ? ['hover', 'click']
                    : false
            }
            cacheFor="1m"
        >
            {content}
        </Link>
    );
}

export function CatalogNavigation({ active, onNavigate }: Props) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/8 bg-[#08101f]/95 px-5 py-7 backdrop-blur-xl lg:flex lg:flex-col">
                <Link
                    href={home()}
                    className="block px-2"
                    aria-label={t('Beta Movies, home')}
                    prefetch={active !== 'acasa' ? ['hover', 'click'] : false}
                    cacheFor="1m"
                >
                    <img
                        src="/icons/betamovies.png"
                        alt="Beta Movies"
                        className="h-auto w-48"
                    />
                </Link>
                <p className="mt-12 px-3 text-[10px] font-black tracking-[.28em] text-slate-600">
                    {t('NAVIGATION')}
                </p>
                <nav
                    className="mt-4 flex flex-col gap-1"
                    aria-label={t('Main navigation')}
                >
                    {navigation.map((item) => (
                        <NavigationItem
                            key={item.page}
                            item={item}
                            active={item.page === active}
                            onNavigate={onNavigate}
                            mobile={false}
                        />
                    ))}
                    {user && (
                        <Link
                            href={adminWatchlistIndex()}
                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active === 'admin' ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/25' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Shield
                                className="size-[18px]"
                                strokeWidth={active === 'admin' ? 2.4 : 1.7}
                            />
                            <span>{t('Admin')}</span>
                        </Link>
                    )}
                </nav>
                <div className="mt-auto rounded-2xl border border-white/8 bg-white/[.025] p-4">
                    <p className="text-xs font-extrabold text-white">
                        Beta Movies
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        {t('Movies · TV Shows')}
                    </p>
                </div>
            </aside>
            <nav
                data-mobile-navigation
                className={`fixed right-0 bottom-0 left-0 z-40 grid border-t border-white/10 bg-[#08101f]/95 px-1 pb-[max(.35rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden ${user ? 'grid-cols-6' : 'grid-cols-5'}`}
                aria-label={t('Mobile navigation')}
            >
                {navigation.map((item) => (
                    <NavigationItem
                        key={item.page}
                        item={item}
                        active={item.page === active}
                        onNavigate={onNavigate}
                        mobile
                    />
                ))}
                {user && (
                    <NavigationItem
                        item={adminNavigation}
                        active={active === 'admin'}
                        mobile
                    />
                )}
            </nav>
        </>
    );
}

export function CatalogFooter() {
    const { t } = useTranslation();
    return (
        <footer className="mb-16 flex flex-col gap-4 border-t border-white/8 px-4 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:mb-0 lg:ml-64 lg:px-10">
            <div>
                <strong className="text-slate-400">Beta Movies</strong>
                <span className="ml-3">
                    {t('Movies and TV shows, all in one place')}
                </span>
            </div>
            <nav
                className="flex flex-wrap gap-x-5 gap-y-2"
                aria-label={t('Legal')}
            >
                <Link
                    href={policyIndex()}
                    className="transition hover:text-sky-300"
                    prefetch={['hover', 'click']}
                    cacheFor="1m"
                >
                    {t('Privacy & DMCA Policy')}
                </Link>
                <Link
                    href={termsIndex()}
                    className="transition hover:text-sky-300"
                    prefetch={['hover', 'click']}
                    cacheFor="1m"
                >
                    {t('Terms & Conditions')}
                </Link>
                <Link
                    href={contactIndex()}
                    className="transition hover:text-sky-300"
                    prefetch={['hover', 'click']}
                    cacheFor="1m"
                >
                    {t('Contact')}
                </Link>
            </nav>
        </footer>
    );
}
