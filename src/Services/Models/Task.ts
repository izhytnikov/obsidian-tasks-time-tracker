export class Task {
    #statusSymbol: string;
    #scheduledDate: Date;

    public constructor(statusSymbol: string, scheduledDate: Date) {
        this.#statusSymbol = statusSymbol;
        this.#scheduledDate = scheduledDate;
    }

    public hasStatusSymbol(symbol: string): boolean {
        return this.#statusSymbol === symbol;
    }

    public getScheduledDate(): Date {
        return this.#scheduledDate;
    }
}