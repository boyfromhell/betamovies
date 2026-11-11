import type { Account } from './tmdb/account.ts';
import type { Catalog } from './tmdb/catalog.ts';
import type { TmdbClient } from './tmdb/client.ts';
import type { StateStore } from './state.ts';
import type { Players } from './players.ts';
import type { Environment, JsonObject, Locale } from './types.ts';

export type Context = {
    request: Request;
    url: URL;
    env: Environment;
    locale: Locale;
    admin: boolean;
    store: StateStore;
    client: TmdbClient;
    catalog: Catalog;
    account: Account;
    players: Players;
    page: (
        component: string,
        props: JsonObject,
        status?: number,
        errors?: JsonObject,
    ) => Response;
};
