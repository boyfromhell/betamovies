import {
    MediaWatchPage,
    type MediaWatchPageProps,
} from '@/components/media-watch-page';
import { index as moviesIndex, show as movieShow } from '@/routes/movies';

export default function MovieWatch(props: MediaWatchPageProps) {
    return (
        <MediaWatchPage
            {...props}
            mediaType="movie"
            active="filme"
            catalogRoute={moviesIndex()}
            detailsRoute={movieShow(props.media.id)}
        />
    );
}
