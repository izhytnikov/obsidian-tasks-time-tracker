import { DateTime } from "obsidian-dataview";
import Nullable from "src/Utils/Nullable";

export default class Task {
    #status: string;
    #scheduledDate: Nullable<DateTime>;

    constructor(status: string, scheduledDate: Nullable<DateTime>) {
        this.#status = status;
        this.#scheduledDate = scheduledDate;
    }

    public getStatus(): string {
        return this.#status;
    }

    public getScheduledDate(): Nullable<Date> {
        return this.#scheduledDate;
    }
}