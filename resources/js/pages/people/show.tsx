import { Link } from '@inertiajs/react';
import { ArrowLeft, Film, LoaderCircle, Star, UserRound } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CatalogHeader } from '@/components/catalog-header';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';
import { SeoHead } from '@/components/seo-head';
import { useTranslation } from '@/hooks/use-translation';
import {
    catalogPosterSizes,
    originalImage,
    posterImage,
} from '@/lib/tmdb-images';
import { home } from '@/routes';
import { show as movieShow } from '@/routes/movies';
import { show as personShow } from '@/routes/people';
import { show as seriesShow } from '@/routes/series';

type Person = {
    id: number;
    name: string;
    slug: string;
    biography: string | null;
    profile_path: string | null;
    known_for_department: string | null;
    birthday: string | null;
    deathday: string | null;
    place_of_birth: string | null;
};

type Credit = {
    id: number;
    mediaType: 'movie' | 'tv';
    title: string;
    year: number | null;
    poster: string | null;
    score: string;
    roles: string[];
};

type Props = {
    person: Person;
    filmography: Credit[];
    pagination: {
        page: number;
        perPage: number;
        totalPages: number;
    };
};

function formattedDate(date: string | null, localeTag: string): string | null {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return null;
    }

    const value = new Date(`${date}T00:00:00Z`);

    if (
        !Number.isFinite(value.getTime()) ||
        value.toISOString().slice(0, 10) !== date
    ) {
        return null;
    }

    return new Intl.DateTimeFormat(localeTag, {
        dateStyle: 'long',
        timeZone: 'UTC',
    }).format(value);
}

function Biography({ text }: { text: string | null }) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const id = useId();
    const collapsible = Boolean(text && text.length > 600);

    return (
        <section>
            <h2 className="text-lg font-black text-white">{t('Biography')}</h2>
            <p
                id={id}
                className={`mt-3 text-sm leading-7 whitespace-pre-line text-slate-300 ${collapsible && !expanded ? 'line-clamp-6' : ''}`}
            >
                {text || t('Biography unavailable.')}
            </p>
            {collapsible && (
                <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    aria-controls={id}
                    aria-expanded={expanded}
                    className="mt-3 cursor-pointer text-sm font-bold text-sky-300 transition hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                >
                    {expanded ? t('Show less') : t('Read more')}
                </button>
            )}
        </section>
    );
}

function Filmography({
    items,
    person,
    pagination,
}: {
    items: Credit[];
    person: Person;
    pagination: Props['pagination'];
}) {
    const { t, localeTag } = useTranslation();
    const [mediaType, setMediaType] = useState<'all' | Credit['mediaType']>(
        'all',
    );
    const [visibleItems, setVisibleItems] = useState(pagination.perPage);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const filteredItems = useMemo(
        () =>
            items.filter(
                (item) => mediaType === 'all' || item.mediaType === mediaType,
            ),
        [items, mediaType],
    );
    const offset =
        mediaType === 'all' ? (pagination.page - 1) * pagination.perPage : 0;
    const currentPage = Math.min(
        pagination.totalPages,
        Math.ceil((offset + visibleItems) / pagination.perPage),
    );
    const pageRoute = (page: number) =>
        personShow(
            { person: person.id, name: person.slug },
            { query: page > 1 ? { page } : undefined },
        );
    const filters = [
        { value: 'all', label: 'All titles', count: items.length },
        {
            value: 'movie',
            label: 'Movies',
            count: items.filter((item) => item.mediaType === 'movie').length,
        },
        {
            value: 'tv',
            label: 'TV Shows',
            count: items.filter((item) => item.mediaType === 'tv').length,
        },
    ] as const;

    useEffect(() => {
        const target = loadMoreRef.current;

        if (target === null || offset + visibleItems >= filteredItems.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisibleItems((current) =>
                        Math.min(
                            current + pagination.perPage,
                            filteredItems.length - offset,
                        ),
                    );
                }
            },
            { rootMargin: '500px' },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [filteredItems.length, offset, pagination.perPage, visibleItems]);

    return (
        <section className="mt-12 border-t border-white/8 pt-8">
            <h2 className="text-2xl font-black text-white">
                {t('Filmography')}
            </h2>
            <div
                className="mt-5 flex flex-wrap gap-2"
                aria-label={t('Filter filmography')}
            >
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        aria-pressed={mediaType === filter.value}
                        onClick={() => {
                            setMediaType(filter.value);
                            setVisibleItems(pagination.perPage);
                        }}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${mediaType === filter.value ? 'border-sky-400 bg-sky-500 text-white' : 'border-white/10 bg-white/[.03] text-slate-400 hover:border-white/20 hover:text-white'}`}
                    >
                        {t(filter.label)}
                        <span className="opacity-70">
                            {filter.count.toLocaleString(localeTag)}
                        </span>
                    </button>
                ))}
            </div>
            {filteredItems.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/8 bg-white/[.025] px-5 py-10 text-center text-sm text-slate-400">
                    {t('No titles are available for this selection.')}
                </p>
            ) : (
                <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {filteredItems
                        .slice(offset, offset + visibleItems)
                        .map((item) => (
                            <Link
                                key={`${item.mediaType}-${item.id}`}
                                href={
                                    item.mediaType === 'movie'
                                        ? movieShow(item.id)
                                        : seriesShow(item.id)
                                }
                                prefetch={['hover', 'click']}
                                cacheFor="1m"
                                className="group min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
                                    {item.poster ? (
                                        <img
                                            {...posterImage(
                                                item.poster,
                                                catalogPosterSizes,
                                            )}
                                            alt={item.title}
                                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                                            <Film
                                                className="size-12"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    )}
                                    <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-1 text-xs font-black text-amber-400 backdrop-blur">
                                        <Star
                                            className="size-3 fill-current"
                                            aria-hidden="true"
                                        />
                                        {Number(item.score).toLocaleString(
                                            localeTag,
                                            {
                                                minimumFractionDigits: 1,
                                                maximumFractionDigits: 1,
                                            },
                                        )}
                                    </span>
                                </div>
                                <h3 className="mt-3 truncate text-sm font-bold text-white transition group-hover:text-sky-300">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-xs text-slate-400">
                                    {item.year ?? '—'} ·{' '}
                                    {item.mediaType === 'movie'
                                        ? t('Movie')
                                        : t('TV Show')}
                                </p>
                                {item.roles.length > 0 && (
                                    <p
                                        className="mt-1 truncate text-xs text-slate-500"
                                        title={item.roles.join(', ')}
                                    >
                                        {item.roles.join(', ')}
                                    </p>
                                )}
                            </Link>
                        ))}
                </div>
            )}
            {offset + visibleItems < filteredItems.length && (
                <div
                    ref={loadMoreRef}
                    className="flex h-20 items-center justify-center gap-2 text-sm font-bold text-slate-500"
                    role="status"
                >
                    <LoaderCircle
                        className="size-4 animate-spin"
                        aria-hidden="true"
                    />
                    {t('Loading more results…')}
                </div>
            )}
            {mediaType === 'all' && pagination.totalPages > 1 && (
                <nav
                    aria-label={t('Pagination')}
                    className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5"
                >
                    <span className="text-xs text-slate-500">
                        {t('Page :page of :pages', {
                            page: currentPage.toLocaleString(localeTag),
                            pages: pagination.totalPages.toLocaleString(
                                localeTag,
                            ),
                        })}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {currentPage > 1 && (
                            <Link
                                href={pageRoute(currentPage - 1)}
                                rel="prev"
                                className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/[.03] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                            >
                                {t('Previous page')}
                            </Link>
                        )}
                        {currentPage < pagination.totalPages && (
                            <Link
                                href={pageRoute(currentPage + 1)}
                                rel="next"
                                className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/[.03] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                            >
                                {t('Next page')}
                            </Link>
                        )}
                    </div>
                </nav>
            )}
        </section>
    );
}

export default function PersonShow({ person, filmography, pagination }: Props) {
    const { t, localeTag } = useTranslation();
    const birthday = formattedDate(person.birthday, localeTag);
    const deathday = formattedDate(person.deathday, localeTag);
    const facts = [
        {
            label: 'Known for',
            value: person.known_for_department
                ? t(person.known_for_department)
                : null,
        },
        { label: 'Born', value: birthday },
        { label: 'Died', value: deathday },
        { label: 'Place of birth', value: person.place_of_birth },
    ].filter((fact) => fact.value);

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={`${person.name} — Beta Movies`} />
            <CatalogNavigation />
            <CatalogHeader />
            <main className="pb-28 lg:ml-64 lg:pb-10">
                <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <Link
                        href={home()}
                        prefetch={['hover', 'click']}
                        cacheFor="1m"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        {t('Back to home')}
                    </Link>
                    <section className="mt-7 grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] items-start gap-x-5 gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-x-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
                        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl sm:row-span-2">
                            {person.profile_path ? (
                                <img
                                    src={originalImage(person.profile_path)}
                                    alt={person.name}
                                    decoding="async"
                                    fetchPriority="high"
                                    className="aspect-[2/3] w-full object-cover"
                                />
                            ) : (
                                <span className="grid aspect-[2/3] place-items-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                                    <UserRound
                                        className="size-12"
                                        aria-hidden="true"
                                    />
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 self-center">
                            <h1 className="text-3xl font-black tracking-tight break-words sm:text-4xl lg:text-5xl">
                                {person.name}
                            </h1>
                            {facts.length > 0 && (
                                <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                                    {facts.map((fact) => (
                                        <div
                                            key={fact.label}
                                            className="min-w-0"
                                        >
                                            <dt className="text-[11px] font-bold text-slate-500">
                                                {t(fact.label)}
                                            </dt>
                                            <dd className="mt-1 text-sm leading-5 break-words text-slate-200">
                                                {fact.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </div>
                        <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-2">
                            <Biography
                                key={person.id}
                                text={person.biography}
                            />
                        </div>
                    </section>
                    <Filmography
                        key={`${person.id}:${pagination.page}`}
                        items={filmography}
                        person={person}
                        pagination={pagination}
                    />
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
