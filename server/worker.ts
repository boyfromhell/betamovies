import { handle } from './app.ts';
import { isBackendRequest } from './platform.ts';
import { setting, type AssetBinding, type Environment } from './types.ts';
import { StateStore } from './state.ts';
import { TmdbClient } from './tmdb/client.ts';
import { Catalog } from './tmdb/catalog.ts';
import { Account } from './tmdb/account.ts';

export default {
    async scheduled(_event: unknown, env: Environment): Promise<void> {
        const store = new StateStore(env);
        store.requireDurable();
        await store.limit('episode-scan', 1, 60);
        const client = new TmdbClient(env, store);
        const catalog = new Catalog(
            client,
            'en',
            setting(env, 'TMDB_REGION', 'US'),
        );
        await new Account(catalog, store, env).scanEpisodes();
    },
    async fetch(
        request: Request,
        env: Environment & { ASSETS: AssetBinding },
    ): Promise<Response> {
        return isBackendRequest(request)
            ? handle(request, env)
            : env.ASSETS.fetch(request);
    },
};
