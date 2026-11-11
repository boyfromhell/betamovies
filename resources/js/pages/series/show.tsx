import { MediaDetailsPage } from '@/components/media-details-page';
import { index as seriesIndex, show as seriesShow } from '@/routes/series';

export default function SeriesShow(
    props: Parameters<typeof MediaDetailsPage>[0],
) {
    return (
        <MediaDetailsPage
            {...props}
            active="seriale"
            backRoute={seriesIndex()}
            showRoute={(id) => seriesShow(id)}
        />
    );
}
