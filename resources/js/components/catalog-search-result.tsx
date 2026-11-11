import { Link } from '@inertiajs/react';
import { Film, Star, UserRound } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { show as movieShow } from '@/routes/movies';
import { show as personShow } from '@/routes/people';
import { show as seriesShow } from '@/routes/series';

export type SearchItem = {
    id: number;
    title: string;
    poster: string | null;
} & (
    | {
          type: 'film' | 'serial';
          year: number | null;
          score: string;
          genre: string;
      }
    | {
          type: 'person';
          slug: string;
          department: string | null;
      }
);

const detailsRoute = (item: SearchItem) => {
    if (item.type === 'person') {
        return personShow({ person: item.id, name: item.slug });
    }

    return item.type === 'film' ? movieShow(item.id) : seriesShow(item.id);
};

export function CatalogSearchResult({
    item,
    onSelect,
}: {
    item: SearchItem;
    onSelect?: () => void;
}) {
    const { t, localeTag } = useTranslation();
    const subtitle = item.type === 'person' ? item.department : item.genre;

    return (
        <Link
            href={detailsRoute(item)}
            onClick={onSelect}
            prefetch
            className="group flex min-w-0 items-start gap-3 rounded-lg p-2.5 text-sm text-slate-300 transition hover:bg-white/[.07] hover:text-white focus-visible:bg-white/[.07] focus-visible:outline-none"
        >
            <span className="grid aspect-[2/3] w-11 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-800 text-slate-600">
                {item.poster ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185${item.poster}`}
                        alt={item.title}
                        className="size-full object-cover"
                    />
                ) : item.type === 'person' ? (
                    <UserRound className="size-5" />
                ) : (
                    <Film className="size-5" />
                )}
            </span>
            <span className="min-w-0 flex-1 self-center">
                <span className="line-clamp-2 text-sm leading-5 font-semibold text-white">
                    {item.title}
                </span>
                <span className="mt-1 flex min-w-0 items-center gap-2 text-xs leading-4 text-slate-400">
                    {item.type === 'person' ? (
                        <span>{t('Person')}</span>
                    ) : (
                        <>
                            <span className="shrink-0 tabular-nums">
                                {item.year ?? '—'}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">
                                ·
                            </span>
                            <span className="shrink-0">
                                {item.type === 'film'
                                    ? t('Movie')
                                    : t('TV Show')}
                            </span>
                            <span className="ml-auto flex shrink-0 items-center gap-1 font-bold text-amber-400 tabular-nums">
                                <Star
                                    aria-hidden="true"
                                    className="size-3 fill-current"
                                />
                                {Number(item.score).toLocaleString(localeTag, {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                })}
                            </span>
                        </>
                    )}
                </span>
                {subtitle && (
                    <span className="mt-1 block truncate text-xs leading-4 text-slate-500">
                        {t(subtitle)}
                    </span>
                )}
            </span>
        </Link>
    );
}
