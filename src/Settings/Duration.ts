import { Nullable2 } from "src/Utils/Nullable";

export default class Duration {
    startDate: Date;
    endDate: Nullable2<Date> = null;

    constructor(startDate: Date) {
        this.startDate = startDate;
    }
}