import {
    createElement,
    type AnchorHTMLAttributes,
    type ReactNode,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';

const page = vi.hoisted(() => ({
    props: {
        locale: 'en',
        auth: { user: null as { id: number } | null },
    },
}));

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string | { url: string };
    children: ReactNode;
};

vi.mock('@inertiajs/react', () => ({
    usePage: () => page,
    Link: ({ href, children, className, ...props }: LinkProps) =>
        createElement(
            'a',
            {
                href: typeof href === 'string' ? href : href.url,
                className,
                'aria-label': props['aria-label'],
                'aria-current': props['aria-current'],
            },
            children,
        ),
}));

const mobileNavigation = (active?: 'admin') => {
    const markup = renderToStaticMarkup(
        createElement(CatalogNavigation, { active }),
    );
    const navigation = markup.match(
        /<nav\b[^>]*\bdata-mobile-navigation(?:="[^"]*")?[^>]*>.*?<\/nav>/s,
    );

    expect(navigation).not.toBeNull();

    return navigation?.[0] ?? '';
};

describe('mobile catalog navigation', () => {
    beforeEach(() => {
        page.props.auth.user = null;
    });

    it('keeps the five public destinations without an admin link for guests', () => {
        const navigation = mobileNavigation();

        expect(navigation.match(/<a\b/g)).toHaveLength(5);
        expect(navigation).not.toContain('href="/admin/watchlist"');
    });

    it('adds a working admin link alongside the public destinations when signed in', () => {
        page.props.auth.user = { id: 1 };

        const navigation = mobileNavigation();

        expect(navigation.match(/<a\b/g)).toHaveLength(6);
        expect(navigation).toContain('href="/admin/watchlist"');
        expect(navigation).toContain('>Admin</span>');
    });

    it('marks the admin destination as the current page', () => {
        page.props.auth.user = { id: 1 };

        const navigation = mobileNavigation('admin');

        expect(navigation).toMatch(
            /<a\b(?=[^>]*href="\/admin\/watchlist")(?=[^>]*aria-current="page")[^>]*>/,
        );
    });

    it('provides a contact link in the shared footer', () => {
        const markup = renderToStaticMarkup(createElement(CatalogFooter));

        expect(markup).toContain('href="/contact"');
        expect(markup).toContain('>Contact</a>');
        expect(markup).toContain('href="/policy"');
        expect(markup).toContain('href="/terms"');
    });
});
