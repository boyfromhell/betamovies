type Environment = { APP_URL: string; CRON_SECRET: string };

export async function runScan(
    env: Environment,
    http: typeof fetch = fetch,
): Promise<void> {
    const url = new URL('/api/scan-episodes', env.APP_URL);
    if (url.protocol !== 'https:' || !env.CRON_SECRET) {
        throw new Error(
            'Configure an HTTPS APP_URL and CRON_SECRET for the scheduler.',
        );
    }
    const response = await http(url, {
        headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
        signal: AbortSignal.timeout(60000),
        redirect: 'error',
    });
    await response.body?.cancel();
    if (!response.ok) {
        throw new Error(`Episode scan returned HTTP ${response.status}.`);
    }
}

export default {
    scheduled: async (_event: unknown, env: Environment): Promise<void> =>
        runScan(env),
};
