const imageBaseUrl = 'https://image.tmdb.org/t/p';

export const catalogPosterSizes =
    '(min-width: 1756px) 224px, (min-width: 1280px) calc((100vw - 416px) / 6), (min-width: 1024px) calc((100vw - 400px) / 5), (min-width: 768px) calc((100vw - 96px) / 4), (min-width: 640px) calc((100vw - 80px) / 3), calc((100vw - 48px) / 2)';

export const railPosterSizes =
    '(min-width: 1756px) 242px, (min-width: 1280px) calc((100vw - 336px) * .17), (min-width: 1024px) calc((100vw - 336px) * .21), (min-width: 640px) calc((100vw - 48px) * .28), calc((100vw - 32px) * .42)';

export const recommendationPosterSizes =
    '(min-width: 1756px) 224px, (min-width: 1024px) calc((100vw - 416px) / 6), (min-width: 640px) calc((100vw - 80px) / 3), calc((100vw - 48px) / 2)';

export const contentImageSizes =
    '(min-width: 1756px) 1420px, (min-width: 1024px) calc(100vw - 336px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)';

export const fullBleedImageSizes =
    '(min-width: 1024px) calc(100vw - 256px), 100vw';

const imageUrl = (path: string | null | undefined, size: string) =>
    path ? `${imageBaseUrl}/${size}/${path.replace(/^\/+/, '')}` : undefined;

const imageProps = (
    path: string | null | undefined,
    widths: number[],
    fallbackWidth: number,
    sizes: string,
) => ({
    src: imageUrl(path, `w${fallbackWidth}`),
    srcSet: path
        ? widths
              .map((width) => `${imageUrl(path, `w${width}`)} ${width}w`)
              .join(', ')
        : undefined,
    sizes,
    decoding: 'async' as const,
});

export const posterImage = (path: string | null | undefined, sizes: string) =>
    imageProps(path, [185, 342, 500, 780], 342, sizes);

export const backdropImage = (path: string | null | undefined, sizes: string) =>
    imageProps(path, [300, 780, 1280], 1280, sizes);

export const stillImage = (path: string | null | undefined, sizes: string) =>
    imageProps(path, [92, 185, 300], 300, sizes);

export const originalImage = (path: string | null | undefined) =>
    imageUrl(path, 'original');
