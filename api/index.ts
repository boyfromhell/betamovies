import { readFile } from 'node:fs/promises';
import { handle } from '../server/app.ts';
import { isBackendRequest, originalRequest } from '../server/platform.ts';

export default {
    async fetch(input: Request): Promise<Response> {
        const request = originalRequest(input);
        if (isBackendRequest(request)) {
            return handle(request, process.env);
        }
        const html = await readFile(`${process.cwd()}/dist/index.html`, 'utf8');
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=0, must-revalidate',
            },
        });
    },
};
