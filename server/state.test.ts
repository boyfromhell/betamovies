import { afterEach, describe, expect, it, vi } from 'vitest';
import { StateStore } from './state.ts';
import type { Environment } from './types.ts';

afterEach(() => vi.useRealTimers());

describe('Cloudflare KV request limiting', () => {
    it('limits requests across store instances without writing a counter repeatedly to KV', async () => {
        const binding = {
            get: vi.fn(async () => null),
            put: vi.fn(async () => {}),
            delete: vi.fn(async () => {}),
        };
        const env: Environment = { STATE: binding };
        await new StateStore(env).limit('search:one', 2, 60);
        await new StateStore(env).limit('search:one', 2, 60);

        await expect(
            new StateStore(env).limit('search:one', 2, 60),
        ).rejects.toMatchObject({ status: 429, type: 'rate_limit' });
        expect(binding.get).not.toHaveBeenCalled();
        expect(binding.put).not.toHaveBeenCalled();
    });

    it('starts a new allowance in the next window and isolates different bindings', async () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-11-11T12:00:00Z'));
        const makeBinding = () => ({
            get: async () => null,
            put: async () => {},
            delete: async () => {},
        });
        const first = new StateStore({ STATE: makeBinding() });
        const second = new StateStore({ STATE: makeBinding() });
        await first.limit('one', 1, 60);
        await second.limit('one', 1, 60);
        await expect(first.limit('one', 1, 60)).rejects.toMatchObject({
            status: 429,
        });
        vi.setSystemTime(new Date('2026-11-11T12:01:00Z'));
        await expect(first.limit('one', 1, 60)).resolves.toBeUndefined();
    });
});
