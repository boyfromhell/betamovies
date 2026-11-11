import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../functions/[[path]].ts';
import vercel from '../api/index.ts';

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
