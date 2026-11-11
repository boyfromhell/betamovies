import { createServer as createHttpServer } from 'node:http';
import { createServer, loadEnv } from 'vite';
import { handle } from './app.ts';
import { isBackendRequest } from './platform.ts';

const environment = () => ({
    ...loadEnv('development', process.cwd(), ''),
    ...process.env,
});
const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
});
const port = Number(process.env.PORT || 8787);
const server = createHttpServer(async (input, output) => {
    try {
        const url = `http://${input.headers.host ?? `localhost:${port}`}${input.url ?? '/'}`;
        const headers = new Headers();
        Object.entries(input.headers).forEach(([key, value]) => {
            if (value) {
                headers.set(
                    key,
                    Array.isArray(value) ? value.join(', ') : value,
                );
            }
        });
        const chunks: Uint8Array[] = [];
        let size = 0;
        for await (const chunk of input) {
            size += chunk.length;
            if (size > 65536) {
                output.writeHead(413).end();
                return;
            }
            chunks.push(chunk);
        }
        const request = new Request(url, {
            method: input.method,
            headers,
            body: ['GET', 'HEAD'].includes(input.method ?? 'GET')
                ? undefined
                : Buffer.concat(chunks),
        });
        if (!isBackendRequest(request)) {
            vite.middlewares(input, output);
            return;
        }
        const response = await handle(request, environment());
        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('set-cookie');
        const cookies = response.headers.getSetCookie();
        if (cookies.length) {
            output.setHeader('Set-Cookie', cookies);
        }
        output.writeHead(response.status, Object.fromEntries(responseHeaders));
        output.end(Buffer.from(await response.arrayBuffer()));
    } catch {
        output.writeHead(500).end('Development server error.');
    }
});
server.listen(port, '0.0.0.0', () => {
    console.log(`Beta Movies: http://localhost:${port}`);
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, () => {
        server.close();
        void vite.close().then(() => process.exit());
    });
}
