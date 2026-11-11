import {
    MediaCatalogPage,
    type MediaCatalogProps,
} from '@/components/media-catalog-page';
import { index as moviesIndex, show as movieShow } from '@/routes/movies';

export default function MoviesIndex(props: MediaCatalogProps) {
    return (
        <MediaCatalogPage
            {...props}
            active="filme"
            title="Movies"
            description="Find the perfect story for your evening."
            popularTitle="Popular movies"
            emptyText="No movies matched your search."
            route={(query) => moviesIndex({ query })}
            showRoute={(id) => movieShow(id)}
        />
    );
}
