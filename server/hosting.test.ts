import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../functions/[[path]].ts';
import vercel from '../api/index.ts';
import worker from './worker.ts';

describe('hosting adapters', () => {
    it('leaves normal page loads and static assets to Cloudflare Pages', async () => {
        const next = vi.fn(async () => new Response('<html>Static app</html>'));
        const response = await onRequest({
            request: new Request('https://movie.example/movies'),
            env: {},
            next,
        });
        expect(next).toHaveBeenCalledOnce();
        expect(await response.text()).toBe('<html>Static app</html>');
    });
    it('serves the shared API through Cloudflare Pages with runtime configuration', async () => {
        const next = vi.fn(async () => new Response('unexpected'));
        const response = await onRequest({
            request: new Request(
                'https://movie.example/api/page?path=/contact',
                { headers: { 'X-Inertia': 'true' } },
            ),
            env: { MAIL_FROM_ADDRESS: 'contact@example.test' },
            next,
        });
        expect((await response.json()).props.contactEmail).toBe(
            'contact@example.test',
        );
        expect(next).not.toHaveBeenCalled();
    });
    it('supports the Vercel Web Handler and preserves the rewritten route', async () => {
        const response = await vercel.fetch(
            new Request('https://movie.example/api/index?__path=/contact', {
                headers: { 'X-Inertia': 'true' },
            }),
        );
        const data = await response.json();
        expect(data.component).toBe('contact');
        expect(data.url).toBe('/contact');
    });
});

describe('Cloudflare Worker hosting', () => {
    it.each(['/', '/movies', '/series/21/a-show/watch/1/4', '/assets/app.js'])(
        'serves normal browser requests through the assets binding: %s',
        async (path) => {
            const assets = vi.fn(async () => new Response('Static app'));
            const request = new Request('https://movie.example' + path);

            const response = await worker.fetch(request, {
                ASSETS: { fetch: assets },
            });

            expect(response.status).toBe(200);
            expect(await response.text()).toBe('Static app');
            expect(assets).toHaveBeenCalledExactlyOnceWith(request);
        },
    );

    it.each(['/contact', '/api/page?path=%2Fcontact'])(
        'serves API requests with runtime variables: %s',
        async (path) => {
            const assets = vi.fn(async () => new Response('unexpected'));
            const response = await worker.fetch(
                new Request('https://movie.example' + path, {
                    headers: { 'X-Inertia': 'true' },
                }),
                {
                    ASSETS: { fetch: assets },
                    MAIL_FROM_ADDRESS: 'contact@example.test',
                    TMDB_API_TOKEN: 'server-only-test-secret',
                },
            );
            const body = await response.text();
            const data = JSON.parse(body);

            expect(response.status).toBe(200);
            expect(data.component).toBe('contact');
            expect(data.props.contactEmail).toBe('contact@example.test');
            expect(body).not.toContain('server-only-test-secret');
            expect(assets).not.toHaveBeenCalled();
        },
    );

    it('handles locale changes without forwarding mutations to static assets', async () => {
        const assets = vi.fn(async () => new Response('unexpected'));
        const response = await worker.fetch(
            new Request('https://movie.example/locale', {
                method: 'POST',
                headers: {
                    Origin: 'https://movie.example',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'locale=ro',
            }),
            { ASSETS: { fetch: assets } },
        );

        expect(response.status).toBe(303);
        expect(response.headers.get('Set-Cookie')).toContain('locale=ro');
        expect(assets).not.toHaveBeenCalled();
    });

    it('protects watch requests before fetching metadata or rendering a player', async () => {
        const assets = vi.fn(async () => new Response('unexpected'));
        const response = await worker.fetch(
            new Request('https://movie.example/series/21/a-show/watch/1/4', {
                headers: { 'X-Inertia': 'true' },
            }),
            { ASSETS: { fetch: assets }, WATCH_PROTECTION_ENABLED: 'true' },
        );

        expect(response.status).toBe(303);
        expect(response.headers.get('Location')).toBe(
            '/watch/verify?redirect=%2Fseries%2F21%2Fa-show%2Fwatch%2F1%2F4',
        );
        expect(assets).not.toHaveBeenCalled();
    });
});
