import { ConfirmActionButton } from '@/components/confirm-action';
import { router, useHttp, usePage } from '@inertiajs/react';
import { Bookmark, BookmarkCheck, LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import {
    destroy as removeFromWatchlist,
    show as watchlistStatus,
    store as addToWatchlist,
} from '@/routes/watchlist';
import type { WatchlistMedia } from '@/types/watchlist';

type WatchlistResponse = {
    watchlisted: boolean;
};

function AuthenticatedWatchlistButton({ media }: { media: WatchlistMedia }) {
    const { t } = useTranslation();
    const [isSaved, setIsSaved] = useState(false);
    const statusRequest = useHttp<Record<string, never>, WatchlistResponse>({});
    const updateRequest = useHttp<Record<string, never>, WatchlistResponse>({});
    const parameters = useMemo(
        () => ({
            mediaType: media.type === 'film' ? 'movie' : 'tv',
            mediaId: media.id,
        }),
        [media.id, media.type],
    );

    useEffect(() => {
        void statusRequest
            .get(watchlistStatus.url(parameters), {
                onSuccess: (response) => setIsSaved(response.watchlisted),
            })
            .catch(() => undefined);

        return () => statusRequest.cancel();
    }, [media.id, media.type]);

    const toggle = () => {
        const request = isSaved
            ? updateRequest.delete(removeFromWatchlist.url(parameters))
            : updateRequest.post(addToWatchlist.url(parameters));

        return request.then((response) => {
            setIsSaved(response.watchlisted);
            router.flushAll();
        });
    };

    const Icon = isSaved ? BookmarkCheck : Bookmark;
    const processing = statusRequest.processing || updateRequest.processing;

    return (
        <ConfirmActionButton
            confirmation={{
                title: t('Remove from Watchlist'),
                description: t('Remove “:title” from the watchlist?', {
                    title: media.title,
                }),
                label: t('Remove'),
            }}
            onConfirm={toggle}
        >
            <button
                type="button"
                onClick={(event) => {
                    if (!isSaved) {
                        event.preventDefault();
                        void toggle().catch(() => undefined);
                    }
                }}
                disabled={processing}
                aria-pressed={isSaved}
                aria-label={
                    isSaved
                        ? t('Remove :title from Watchlist', {
                              title: media.title,
                          })
                        : t('Add :title to Watchlist', { title: media.title })
                }
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-sm font-black transition disabled:cursor-wait disabled:opacity-60 ${
                    isSaved
                        ? 'border-sky-400/50 bg-sky-400/15 text-sky-200 hover:bg-sky-400/25'
                        : 'border-white/15 bg-white/8 text-white hover:bg-white/15'
                }`}
            >
                {processing ? (
                    <LoaderCircle className="size-4 animate-spin" />
                ) : (
                    <Icon
                        className={`size-4 ${isSaved ? 'fill-current' : ''}`}
                    />
                )}
                {isSaved ? t('Remove from Watchlist') : t('Add to Watchlist')}
            </button>
        </ConfirmActionButton>
    );
}

export function WatchlistButton({ media }: { media: WatchlistMedia }) {
    const { auth } = usePage().props;

    if (auth.user === null) {
        return null;
    }

    return <AuthenticatedWatchlistButton media={media} />;
}
