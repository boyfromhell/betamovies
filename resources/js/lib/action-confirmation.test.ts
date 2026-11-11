import { describe, expect, it } from 'vite-plus/test';
import { ActionConfirmation } from './action-confirmation';

describe('action confirmation', () => {
    it('blocks an action until the user explicitly confirms it', () => {
        const confirmation = new ActionConfirmation();
        expect(confirmation.begin()).toBe(false);
        expect(confirmation.approve()).toBe(true);
        expect(confirmation.begin()).toBe(true);
    });

    it('consumes approval once and prevents duplicate submissions', () => {
        const confirmation = new ActionConfirmation();
        confirmation.approve();
        expect(confirmation.begin()).toBe(true);
        expect(confirmation.processing).toBe(true);
        expect(confirmation.begin()).toBe(false);
        expect(confirmation.approve()).toBe(false);
    });

    it('requires a new confirmation after completing or cancelling an action', () => {
        const confirmation = new ActionConfirmation();
        confirmation.approve();
        confirmation.reset();
        expect(confirmation.begin()).toBe(false);
        confirmation.approve();
        confirmation.begin();
        confirmation.reset();
        expect(confirmation.processing).toBe(false);
        expect(confirmation.begin()).toBe(false);
        confirmation.approve();
        expect(confirmation.begin()).toBe(true);
    });
});
