import {
    object,
    rows,
    setting,
    text,
    type Environment,
    type JsonObject,
    type Locale,
} from './types.ts';

export function seo(
    url: URL,
    env: Environment,
    locale: Locale,
    component: string,
    props: JsonObject,
): JsonObject {
    const appName = setting(env, 'APP_NAME', 'Beta Movies');
    const media = object(props.media),
        person = object(props.person);
    const names: Record<string, string> = {
        welcome: locale === 'ro' ? 'Acasă' : 'Home',
        'movies/index': locale === 'ro' ? 'Filme' : 'Movies',
        'series/index': locale === 'ro' ? 'Seriale' : 'TV Shows',
        contact: 'Contact',
        legal:
            props.document === 'terms'
                ? 'Terms & Conditions'
                : 'Privacy & DMCA Policy',
        watchlist: 'Watchlist',
        history: locale === 'ro' ? 'Istoric' : 'History',
    };
    const baseTitle = text(
        media.title ?? media.name ?? person.name,
        names[component] ?? 'Beta Movies',
    );
    const page = Number(url.searchParams.get('page')) || 1;
    const title = `${baseTitle}${page > 1 ? ` — ${locale === 'ro' ? 'Pagina' : 'Page'} ${page}` : ''} — ${appName}`;
    const description = (
        text(media.overview ?? person.biography) ||
        (locale === 'ro'
            ? `Descoperă filme, seriale și distribuția lor pe ${appName}.`
            : `Discover movies, TV shows and their cast on ${appName}.`)
    ).slice(0, 160);
    const path = text(
        media.backdrop_path ?? media.poster_path ?? person.profile_path,
    );
    const origin = setting(env, 'APP_URL', url.origin).replace(/\/$/, '');
    const canonical = new URL(url.pathname, origin);
    for (const key of ['list', 'genre', 'page']) {
        if (url.searchParams.has(key)) {
            canonical.searchParams.set(key, url.searchParams.get(key)!);
        }
    }
    const watch = component.endsWith('/watch');
    const isPerson = component === 'people/show';
    let structuredData: JsonObject | null = null;
    if (isPerson) {
        structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: person.name,
            description: text(person.biography),
            url: canonical.toString(),
        };
    } else if (media.id && !watch) {
        structuredData = {
            '@context': 'https://schema.org',
            '@type': component.startsWith('movies/') ? 'Movie' : 'TVSeries',
            name: media.title ?? media.name,
            description: text(media.overview),
            genre: rows(media.genres).map((genre) => genre.name),
            url: canonical.toString(),
        };
    }
    return {
        title,
        description,
        canonical: canonical.toString(),
        robots:
            watch ||
            component.startsWith('admin/') ||
            ['history', 'watchlist', 'watch-verification', 'error'].includes(
                component,
            ) ||
            url.searchParams.has('q')
                ? 'noindex, nofollow'
                : 'index, follow',
        image: path
            ? `https://image.tmdb.org/t/p/w1280${path}`
            : `${origin}/icons/betamovies.png`,
        imageAlt: baseTitle,
        type: isPerson ? 'profile' : media.id ? 'video.movie' : 'website',
        siteName: appName,
        locale: locale === 'ro' ? 'ro_RO' : 'en_US',
        structuredData: structuredData
            ? JSON.stringify(structuredData).replace(/</g, '\\u003c')
            : null,
    };
}
