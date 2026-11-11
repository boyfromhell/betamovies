import { handle } from './app.ts';
import { isBackendRequest } from './platform.ts';
import type { AssetBinding, Environment } from './types.ts';

export default {
    async fetch(
        request: Request,
        env: Environment & { ASSETS: AssetBinding },
    ): Promise<Response> {
        return isBackendRequest(request)
            ? handle(request, env)
            : env.ASSETS.fetch(request);
    },
};
