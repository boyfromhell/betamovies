import { MediaDetailsPage } from '@/components/media-details-page';
import { index as moviesIndex, show as movieShow } from '@/routes/movies';

export default function MovieShow(
    props: Parameters<typeof MediaDetailsPage>[0],
) {
    return (
        <MediaDetailsPage
            {...props}
            active="filme"
            backRoute={moviesIndex()}
            showRoute={(id) => movieShow(id)}
        />
    );
}
