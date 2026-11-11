import {
    MediaWatchPage,
    type MediaWatchPageProps,
} from '@/components/media-watch-page';
import {
    index as seriesIndex,
    show as seriesShow,
    watch as seriesWatch,
} from '@/routes/series';

export default function SeriesWatch(props: MediaWatchPageProps) {
    return (
        <MediaWatchPage
            {...props}
            mediaType="tv"
            active="seriale"
            catalogRoute={seriesIndex()}
            detailsRoute={seriesShow(props.media.id)}
            episodeRoute={(season, episode) =>
                seriesWatch({
                    series: props.media.id,
                    name: props.slug,
                    season,
                    episode,
                })
            }
        />
    );
}
