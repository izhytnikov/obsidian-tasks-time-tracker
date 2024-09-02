import { Nullable2 } from "src/Utils/Nullable";

export class Duration {
    startDate: Date;
    endDate: Nullable2<Date>;

    constructor(startDate: Date, endDate: Nullable2<Date> = null) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public isInProgress2(): boolean {
        return this.endDate === null;
    }

    public setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }
}