import {
    MediaCatalogPage,
    type MediaCatalogProps,
} from '@/components/media-catalog-page';
import { index as seriesIndex, show as seriesShow } from '@/routes/series';

export default function SeriesIndex(props: MediaCatalogProps) {
    return (
        <MediaCatalogPage
            {...props}
            active="seriale"
            title="TV Shows"
            description="Discover a show for every mood."
            popularTitle="Popular TV shows"
            emptyText="No TV shows matched your search."
            route={(query) => seriesIndex({ query })}
            showRoute={(id) => seriesShow(id)}
        />
    );
}
