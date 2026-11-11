import type { SeoMetadata } from './seo';

export {};

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            locale?: 'en' | 'ro';
            name: string;
            seo?: SeoMetadata;
            auth: {
                user: {
                    id: number;
                    name: string;
                    email: string;
                } | null;
            };
            [key: string]: unknown;
        };
    }
}
