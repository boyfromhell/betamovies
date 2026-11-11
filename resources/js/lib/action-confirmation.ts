export class ActionConfirmation {
    private approved = false;
    private active = false;

    get processing(): boolean {
        return this.active;
    }

    approve(): boolean {
        if (this.active) {
            return false;
        }
        this.approved = true;
        return true;
    }

    begin(): boolean {
        if (!this.approved || this.active) {
            return false;
        }
        this.approved = false;
        this.active = true;
        return true;
    }

    reset(): void {
        this.approved = false;
        this.active = false;
    }
}
