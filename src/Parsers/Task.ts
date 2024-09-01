import Nullable from "src/Utils/Nullable";

export default class Task {
    #statusSymbol: string;
    #scheduledDate: Nullable<Date>;

    constructor(statusSymbol: string, scheduledDate: Nullable<Date>) {
        this.#statusSymbol = statusSymbol;
        this.#scheduledDate = scheduledDate;
    }

    public getStatusSymbol(): string {
        return this.#statusSymbol;
    }

    public getScheduledDate(): Nullable<Date> {
        return this.#scheduledDate;
    }
}