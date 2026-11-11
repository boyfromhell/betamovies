export type SeoMetadata = {
    title: string;
    description: string;
    canonical: string | null;
    robots: string;
    image: string | null;
    imageAlt: string | null;
    type: string;
    siteName: string;
    locale: string;
    structuredData: string | null;
};
