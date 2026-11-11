import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

let version: string | null = null;
try {
    version = execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
} catch {
    version = null;
}

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    define: {
        __APP_BUILD__: JSON.stringify({
            version,
            builtAt: new Date().toISOString(),
        }),
    },
    server: { host: '127.0.0.1', port: 5174, strictPort: true },
    lint: {
        ignorePatterns: [
            'dist/**',
            'node_modules/**',
            'resources/js/actions/**',
            'resources/js/routes/**',
            'resources/js/wayfinder/**',
            'resources/js/components/ui/**',
        ],
        options: { denyWarnings: true },
    },
    fmt: {
        printWidth: 80,
        tabWidth: 4,
        singleQuote: true,
        semi: true,
        sortTailwindcss: {
            functions: ['clsx', 'cn', 'cva'],
            stylesheet: 'resources/css/app.css',
        },
        ignorePatterns: [
            'dist/**',
            'node_modules/**',
            'package-lock.json',
            'resources/js/actions/**',
            'resources/js/routes/**',
            'resources/js/wayfinder/**',
            'resources/js/components/ui/**',
        ],
    },
});
