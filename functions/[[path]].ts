import { handle } from '../server/app.ts';
import { isBackendRequest } from '../server/platform.ts';
import type { Environment } from '../server/types.ts';

export async function onRequest(context: {
    request: Request;
    env: Environment;
    next: () => Promise<Response>;
}): Promise<Response> {
    return isBackendRequest(context.request)
        ? handle(context.request, context.env)
        : context.next();
}
