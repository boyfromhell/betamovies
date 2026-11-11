import {
    createElement,
    type AnchorHTMLAttributes,
    type ReactNode,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vite-plus/test';
import PersonShow from '@/pages/people/show';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string | { url: string };
    children: ReactNode;
};

vi.mock('@inertiajs/react', () => ({
    usePage: () => ({ props: { locale: 'en' } }),
    Link: ({ href, children, rel }: LinkProps) =>
        createElement(
            'a',
            {
                href: typeof href === 'string' ? href : href.url,
                rel,
            },
            children,
        ),
}));
vi.mock('@/components/catalog-header', () => ({ CatalogHeader: () => null }));
vi.mock('@/components/catalog-navigation', () => ({
    CatalogNavigation: () => null,
    CatalogFooter: () => null,
}));
vi.mock('@/components/seo-head', () => ({ SeoHead: () => null }));

const person = {
    id: 42,
    name: 'Avery Actor',
    slug: 'avery-actor',
    biography: null,
    profile_path: null,
    known_for_department: null,
    birthday: null,
    deathday: null,
    place_of_birth: null,
};
const filmography = Array.from({ length: 49 }, (_, index) => ({
    id: index + 1,
    mediaType: 'movie' as const,
    title: `Film ${index + 1}`,
    year: 2026,
    poster: null,
    score: '8.0',
    roles: [],
}));
const renderPage = (page: number) =>
    renderToStaticMarkup(
        createElement(PersonShow, {
            person,
            filmography,
            pagination: { page, perPage: 24, totalPages: 3 },
        }),
    );

describe('crawlable person filmography', () => {
    it('renders the initial titles and an actual link to the next page', () => {
        const markup = renderPage(1);

        expect(markup).toContain('href="/movies/1"');
        expect(markup).toContain('href="/movies/24"');
        expect(markup).not.toContain('href="/movies/25"');
        expect(markup).toContain(
            'href="/people/42/avery-actor?page=2" rel="next"',
        );
        expect(markup).not.toContain('rel="prev"');
    });

    it('renders a distinct second chunk with working previous and next links', () => {
        const markup = renderPage(2);

        expect(markup).toContain('href="/movies/25"');
        expect(markup).toContain('href="/movies/48"');
        expect(markup).not.toContain('href="/movies/1"');
        expect(markup).not.toContain('href="/movies/49"');
        expect(markup).toContain('href="/people/42/avery-actor" rel="prev"');
        expect(markup).toContain(
            'href="/people/42/avery-actor?page=3" rel="next"',
        );
    });
});
