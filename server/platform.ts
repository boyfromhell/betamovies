export function originalRequest(request: Request): Request {
    const url = new URL(request.url);
    const path = url.searchParams.get('__path');
    if (
        !path ||
        !path.startsWith('/') ||
        path.startsWith('//') ||
        /[\\\r\n]/.test(path)
    ) {
        return request;
    }
    url.pathname = path;
    url.searchParams.delete('__path');
    return new Request(url, request);
}

export function isBackendRequest(request: Request): boolean {
    const path = new URL(request.url).pathname;
    return (
        (request.method !== 'GET' && request.method !== 'HEAD') ||
        request.headers.get('X-Inertia') === 'true' ||
        path.startsWith('/api/') ||
        path === '/catalog/search' ||
        /^\/watchlist\/(movie|tv)\/\d+$/.test(path) ||
        path === '/sitemap.xml' ||
        ['/admin/tmdb/connect', '/admin/tmdb/callback'].includes(path)
    );
}
