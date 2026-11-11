import { Link, useHttp } from '@inertiajs/react';
import { LoaderCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    CatalogSearchResult,
    type SearchItem,
} from '@/components/catalog-search-result';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { home } from '@/routes';
import { search as catalogSearch } from '@/routes/catalog';

type SearchResponse = {
    items: SearchItem[];
};

function CatalogSearch() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchItem[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);
    const { data, setData, get, processing, cancel } = useHttp<
        { q: string },
        SearchResponse
    >({ q: '' });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const query = data.q.trim();
        setResults([]);
        setHasSearched(false);
        setHasFailed(false);

        if (query.length < 2) {
            cancel();

            return;
        }

        const timeout = window.setTimeout(() => {
            cancel();
            void get(catalogSearch.url(), {
                onSuccess: (response) => {
                    setResults(response.items);
                    setHasSearched(true);
                },
                onHttpException: () => setHasFailed(true),
                onNetworkError: () => setHasFailed(true),
            }).catch(() => undefined);
        }, 300);

        return () => {
            window.clearTimeout(timeout);
            cancel();
        };
    }, [cancel, data.q, get, isOpen]);

    const closeSearch = () => {
        setIsOpen(false);
        setData('q', '');
        setResults([]);
        setHasSearched(false);
        setHasFailed(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (open) {
                    setIsOpen(true);
                } else {
                    closeSearch();
                }
            }}
        >
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="ml-auto flex size-11 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-left text-sm text-slate-400 transition hover:border-white/40 hover:bg-white/[.08] hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none sm:w-full sm:max-w-xl sm:shrink sm:justify-start sm:px-4"
                    aria-label={t('Open search')}
                >
                    <Search className="size-4 shrink-0" />
                    <span className="hidden truncate sm:block">
                        {t('Search movies, TV shows or people…')}
                    </span>
                </button>
            </DialogTrigger>

            <DialogContent className="top-4 flex max-h-[calc(100dvh-2rem)] translate-y-0 flex-col gap-2 overflow-visible border-0 bg-transparent p-0 text-slate-200 shadow-none sm:top-8 sm:max-h-[calc(100dvh-4rem)] sm:max-w-lg">
                <DialogTitle className="sr-only">
                    {t('Search movies, TV shows and people')}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    {t(
                        'Enter at least two characters and choose a result from the list.',
                    )}
                </DialogDescription>

                <div className="relative shrink-0 rounded-xl border border-white/10 bg-[#0d1728] shadow-2xl shadow-black/60">
                    <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        name="q"
                        role="searchbox"
                        value={data.q}
                        onChange={(event) => setData('q', event.target.value)}
                        aria-label={t('Search movies, TV shows and people')}
                        autoComplete="off"
                        autoFocus
                        className="h-12 w-full rounded-xl bg-transparent pr-12 pl-11 text-base text-white outline-none placeholder:text-slate-500 focus:ring-accent-foreground"
                    />
                    {processing && (
                        <LoaderCircle className="absolute top-1/2 right-12 size-4 -translate-y-1/2 animate-spin text-sky-400" />
                    )}
                </div>

                {data.q.trim().length >= 2 && (
                    <div className="max-h-[450px] min-h-0 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#0d1728] p-1.5 scheme-dark shadow-2xl shadow-black/60">
                        {results.length > 0 ? (
                            <div className="space-y-0.5">
                                {results.map((item) => (
                                    <CatalogSearchResult
                                        key={`${item.type}-${item.id}`}
                                        item={item}
                                        onSelect={closeSearch}
                                    />
                                ))}
                            </div>
                        ) : hasFailed ? (
                            <p className="px-4 py-8 text-center text-sm text-rose-300">
                                {t('Search is currently unavailable.')}
                            </p>
                        ) : hasSearched && !processing ? (
                            <p className="px-4 py-8 text-center text-sm text-slate-400">
                                {t('No results found.')}
                            </p>
                        ) : (
                            <div className="grid h-20 place-items-center">
                                <LoaderCircle className="size-5 animate-spin text-sky-400" />
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export function CatalogHeader() {
    const { t } = useTranslation();
    return (
        <header className="sticky top-0 z-30 border-b border-white/8 bg-[#070d1a]/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:ml-64 lg:px-10">
            <div className="mx-auto flex max-w-[1500px] items-center gap-2 sm:gap-4">
                <Link
                    href={home()}
                    className="shrink-0 lg:hidden"
                    aria-label={t('Beta Movies, home')}
                    prefetch={['hover', 'click']}
                    cacheFor="1m"
                >
                    <img
                        src="/icons/betamovies.png"
                        alt="Beta Movies"
                        className="w-28 sm:w-44"
                    />
                </Link>
                <CatalogSearch />
                <LanguageSwitcher />
                <span className="hidden shrink-0 text-xs font-bold tracking-wide text-slate-500 xl:block">
                    {t('MOVIES · TV SHOWS')}
                </span>
            </div>
        </header>
    );
}
