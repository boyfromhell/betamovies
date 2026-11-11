import { Link } from '@inertiajs/react';
import { ArrowLeft, Film, Play, Star } from 'lucide-react';
import { CatalogHeader } from '@/components/catalog-header';
import { SeoHead } from '@/components/seo-head';
import {
    CatalogFooter,
    CatalogNavigation,
    type CatalogPage,
} from '@/components/catalog-navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { WatchlistButton } from '@/components/watchlist-button';
import { useTranslation } from '@/hooks/use-translation';
import {
    backdropImage,
    fullBleedImageSizes,
    originalImage,
    posterImage,
    recommendationPosterSizes,
} from '@/lib/tmdb-images';
import { index as moviesIndex } from '@/routes/movies';
import { show as personShow } from '@/routes/people';
import { index as seriesIndex } from '@/routes/series';

type Genre = { id: number; name: string };
type CastMember = {
    id: number;
    name: string;
    slug: string;
    character?: string;
    roles?: Array<{ character?: string }>;
};
type Video = {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official?: boolean;
};
type Related = {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    vote_average?: number;
};
type Media = {
    id: number;
    title?: string;
    name?: string;
    overview?: string;
    backdrop_path?: string | null;
    poster_path?: string | null;
    release_date?: string;
    first_air_date?: string;
    runtime?: number | null;
    episode_run_time?: number[];
    number_of_seasons?: number;
    status?: string | null;
    vote_average?: number;
    genres?: Genre[];
    tagline?: string;
    credits?: { cast?: CastMember[] };
    aggregate_credits?: { cast?: CastMember[] };
    videos?: { results?: Video[] };
    recommendations?: { results?: Related[] };
};

type Props = {
    media: Media;
    mediaType: 'movie' | 'tv';
    active: CatalogPage;
    backRoute: { url: string; method: 'get' };
    showRoute: (id: number) => { url: string; method: 'get' };
    watchRoute: { url: string; method: 'get' };
};
export function MediaDetailsPage({
    media,
    mediaType,
    active,
    backRoute,
    showRoute,
    watchRoute,
}: Props) {
    const { t, localeTag } = useTranslation();
    const genreRoute = mediaType === 'movie' ? moviesIndex : seriesIndex;
    const title = media.title ?? media.name ?? t('Title unavailable');
    const date = media.release_date ?? media.first_air_date;
    const cast = (
        media.credits?.cast ??
        media.aggregate_credits?.cast ??
        []
    ).slice(0, 8);
    const trailer =
        media.videos?.results?.find(
            (video) =>
                video.site === 'YouTube' &&
                video.type === 'Trailer' &&
                video.official,
        ) ?? media.videos?.results?.find((video) => video.site === 'YouTube');
    const related = (media.recommendations?.results ?? []).slice(0, 6);

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={`${title} — Beta Movies`} />
            <CatalogNavigation active={active} />
            <CatalogHeader />
            <main className="pb-20 lg:ml-64">
                <section className="relative min-h-[34rem] overflow-hidden">
                    {media.backdrop_path && (
                        <picture>
                            <source
                                media="(min-width: 1600px)"
                                srcSet={originalImage(media.backdrop_path)}
                            />
                            <img
                                {...backdropImage(
                                    media.backdrop_path,
                                    fullBleedImageSizes,
                                )}
                                alt=""
                                className="absolute inset-0 size-full object-cover opacity-35"
                            />
                        </picture>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a] via-[#070d1a]/65 to-[#070d1a]/30" />
                    <div className="relative mx-auto flex max-w-[1500px] flex-col gap-8 px-4 pt-8 pb-14 sm:px-6 lg:flex-row lg:items-end lg:px-10 lg:pt-16">
                        <div className="w-44 shrink-0 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl sm:w-56">
                            {media.poster_path ? (
                                <img
                                    {...posterImage(
                                        media.poster_path,
                                        '(min-width: 640px) 224px, 176px',
                                    )}
                                    alt={title}
                                    className="aspect-[2/3] size-full object-cover"
                                    fetchPriority="high"
                                />
                            ) : (
                                <div className="grid aspect-[2/3] place-items-center text-slate-600">
                                    <Film className="size-14" />
                                </div>
                            )}
                        </div>
                        <div className="max-w-3xl pb-2">
                            <Link
                                href={backRoute}
                                className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-white"
                            >
                                <ArrowLeft className="size-4" />
                                {t(
                                    mediaType === 'movie'
                                        ? 'Back to movies'
                                        : 'Back to TV shows',
                                )}
                            </Link>
                            {(media.tagline ||
                                (mediaType === 'tv' && media.status)) && (
                                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                                    {mediaType === 'tv' && media.status && (
                                        <span
                                            data-status={media.status}
                                            aria-label={t(
                                                'Series status: :status',
                                                { status: t(media.status) },
                                            )}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[11px] font-black tracking-[.12em] text-sky-200 uppercase data-[status=Canceled]:border-rose-400/20 data-[status=Canceled]:bg-rose-400/10 data-[status=Canceled]:text-rose-300 data-[status=Ended]:border-amber-400/20 data-[status=Ended]:bg-amber-400/10 data-[status=Ended]:text-amber-200 data-[status^=Returning]:border-emerald-400/20 data-[status^=Returning]:bg-emerald-400/10 data-[status^=Returning]:text-emerald-300"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="size-1.5 rounded-full bg-current"
                                            />
                                            {t(media.status)}
                                        </span>
                                    )}
                                    {media.tagline && (
                                        <p className="text-sm font-bold text-sky-300">
                                            {media.tagline}
                                        </p>
                                    )}
                                </div>
                            )}
                            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                                {title}
                            </h1>
                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                                <span className="flex items-center gap-1 font-black text-amber-400">
                                    <Star className="size-4 fill-current" />{' '}
                                    {Number(
                                        media.vote_average ?? 0,
                                    ).toLocaleString(localeTag, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                    })}
                                </span>
                                {date && <span>{date.slice(0, 4)}</span>}
                                {mediaType === 'movie' && media.runtime ? (
                                    <span>{media.runtime} min</span>
                                ) : null}
                                {mediaType === 'tv' &&
                                media.number_of_seasons ? (
                                    <span>
                                        {t(
                                            media.number_of_seasons === 1
                                                ? ':count season'
                                                : ':count seasons',
                                            { count: media.number_of_seasons },
                                        )}
                                    </span>
                                ) : null}
                                {media.genres?.map((genre) => (
                                    <Link
                                        key={genre.id}
                                        href={genreRoute({
                                            query: { genre: genre.id },
                                        })}
                                        prefetch={['hover', 'click']}
                                        cacheFor="1m"
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:border-sky-400/50 hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                                    >
                                        {genre.name}
                                    </Link>
                                ))}
                            </div>
                            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
                                {media.overview ||
                                    t('Description unavailable.')}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    href={watchRoute}
                                    className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-400"
                                >
                                    <Play className="size-4 fill-current" />
                                    {t('Watch now')}
                                </Link>
                                <WatchlistButton
                                    media={{
                                        id: media.id,
                                        title,
                                        year: date
                                            ? Number(date.slice(0, 4))
                                            : null,
                                        score: Number(
                                            media.vote_average ?? 0,
                                        ).toFixed(1),
                                        genre:
                                            media.genres?.[0]?.name ??
                                            t('Other'),
                                        type:
                                            mediaType === 'movie'
                                                ? 'film'
                                                : 'serial',
                                        poster: media.poster_path ?? null,
                                    }}
                                />
                                {trailer && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button
                                                type="button"
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                                            >
                                                <Play className="size-4 fill-current" />{' '}
                                                {t('Watch trailer')}
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="overflow-hidden border-white/10 bg-[#070d1a] p-0 text-white sm:max-w-5xl">
                                            <div className="px-5 pt-5 pr-14 pb-4">
                                                <DialogTitle className="text-lg font-black">
                                                    {trailer.name ||
                                                        t('Trailer :title', {
                                                            title,
                                                        })}
                                                </DialogTitle>
                                                <DialogDescription className="sr-only">
                                                    {t(
                                                        'Video trailer for :title',
                                                        { title },
                                                    )}
                                                </DialogDescription>
                                            </div>
                                            <div className="aspect-video w-full bg-black">
                                                <iframe
                                                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}?autoplay=1&rel=0`}
                                                    title={
                                                        trailer.name ||
                                                        t('Trailer :title', {
                                                            title,
                                                        })
                                                    }
                                                    className="size-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-[1500px] space-y-12 px-4 sm:px-6 lg:px-10">
                    {cast.length > 0 && (
                        <section>
                            <h2 className="mb-5 text-2xl font-black">
                                {t('Cast')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                                {cast.map((person) => (
                                    <article
                                        key={person.id}
                                        className="rounded-2xl border border-white/8 bg-white/[.03] p-4"
                                    >
                                        <Link
                                            href={personShow({
                                                person: person.id,
                                                name: person.slug,
                                            })}
                                            prefetch={['hover', 'click']}
                                            cacheFor="1m"
                                            className="font-bold text-white transition hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                                        >
                                            {person.name}
                                        </Link>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {person.character ??
                                                person.roles?.[0]?.character ??
                                                t('Cast')}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                    {related.length > 0 && (
                        <section>
                            <h2 className="mb-5 text-2xl font-black">
                                {t('Recommendations')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={showRoute(item.id)}
                                        prefetch={['hover', 'click']}
                                        cacheFor="1m"
                                        className="group"
                                    >
                                        <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-slate-900">
                                            {item.poster_path ? (
                                                <img
                                                    {...posterImage(
                                                        item.poster_path,
                                                        recommendationPosterSizes,
                                                    )}
                                                    alt={
                                                        item.title ??
                                                        item.name ??
                                                        ''
                                                    }
                                                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="grid size-full place-items-center">
                                                    <Film className="size-10 text-slate-700" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="mt-3 truncate text-sm font-bold">
                                            {item.title ?? item.name}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
