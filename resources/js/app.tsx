import { createInertiaApp } from '@inertiajs/react';
import '../css/app.css';
import type { Page } from '@inertiajs/core';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Beta Movies';
const pages = import.meta.glob('./pages/**/*.tsx');

async function start(): Promise<void> {
    const path = window.location.pathname + window.location.search;
    const response = await fetch(`/api/page?path=${encodeURIComponent(path)}`, {
        headers: { 'X-Inertia': 'true', Accept: 'application/json' },
        credentials: 'same-origin',
    });
    const location = response.headers.get('X-Inertia-Location');
    if (location) {
        window.location.assign(location);
        return;
    }
    if (response.headers.get('X-Inertia') !== 'true') {
        throw new Error('The application API could not be loaded.');
    }
    const page = (await response.json()) as Page;
    if (!page.component || !page.props || !page.url.startsWith('/')) {
        throw new Error('The application API returned an invalid page.');
    }
    if (page.url !== path) {
        window.history.replaceState(null, '', page.url);
    }
    await createInertiaApp({
        page,
        resolve: async (name) => {
            const load = pages[`./pages/${name}.tsx`];
            if (!load) {
                throw new Error(`Unknown page: ${name}`);
            }
            return (
                (await load()) as { default: import('react').ComponentType }
            ).default;
        },
        title: (title) => title || appName,
        strictMode: true,
        withApp(app) {
            return (
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            );
        },
        progress: {
            color: '#0065af',
        },
    });
}

void start().catch(() => {
    const element = document.getElementById('app');
    if (element) {
        element.replaceChildren();
        const message = document.createElement('p');
        message.id = 'startup';
        message.textContent =
            'The website is temporarily unavailable. Please refresh the page.';
        message.setAttribute('role', 'alert');
        element.append(message);
    }
});

// This will set light / dark mode on load...
initializeTheme();
