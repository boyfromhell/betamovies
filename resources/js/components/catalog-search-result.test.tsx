import {
    createElement,
    type AnchorHTMLAttributes,
    type ReactNode,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
    CatalogSearchResult,
    type SearchItem,
} from '@/components/catalog-search-result';

const page = vi.hoisted(() => ({ props: { locale: 'en' } }));

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string | { url: string };
    children: ReactNode;
};

vi.mock('@inertiajs/react', () => ({
    usePage: () => page,
    Link: ({ href, children }: LinkProps) =>
        createElement(
            'a',
            { href: typeof href === 'string' ? href : href.url },
            children,
        ),
}));

const renderResult = (item: SearchItem) =>
    renderToStaticMarkup(createElement(CatalogSearchResult, { item }));

describe('catalog search results', () => {
    beforeEach(() => {
        page.props.locale = 'en';
    });

    it('links people to their profile and translates their department without a rating', () => {
        page.props.locale = 'ro';

        const markup = renderResult({
            id: 42,
            title: 'Avery Actor',
            slug: 'avery-actor',
            type: 'person',
            poster: '/avery.jpg',
            department: 'Acting',
        });

        expect(markup).toContain('href="/people/42/avery-actor"');
        expect(markup).toContain('>Avery Actor</span>');
        expect(markup).toContain(
            'src="https://image.tmdb.org/t/p/w185/avery.jpg"',
        );
        expect(markup).toContain('>Persoană</span>');
        expect(markup).toContain('>Actorie</span>');
        expect(markup).not.toContain('lucide-star');
        expect(markup).not.toContain('>—</span>');
        expect(markup).not.toContain('NaN');
    });

    it('renders people without a photo or department', () => {
        const markup = renderResult({
            id: 43,
            title: 'Another Person',
            slug: 'another-person',
            type: 'person',
            poster: null,
            department: null,
        });

        expect(markup).toContain('href="/people/43/another-person"');
        expect(markup).toContain('>Another Person</span>');
        expect(markup).toContain('>Person</span>');
        expect(markup).not.toContain('<img');
        expect(markup).not.toContain('NaN');
    });

    it.each([
        { type: 'film' as const, path: '/movies/10', label: 'Movie' },
        { type: 'serial' as const, path: '/series/10', label: 'TV Show' },
    ])(
        'keeps the link, year and rating for $type results',
        ({ type, path, label }) => {
            const markup = renderResult({
                id: 10,
                title: 'Found title',
                type,
                poster: null,
                year: 2026,
                score: '8.3',
                genre: 'Action',
            });

            expect(markup).toContain(`href="${path}"`);
            expect(markup).toContain('>2026</span>');
            expect(markup).toContain(`>${label}</span>`);
            expect(markup).toContain('8.3</span>');
            expect(markup).toContain('>Action</span>');
        },
    );
});
