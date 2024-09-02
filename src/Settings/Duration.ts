import { Nullable2 } from "src/Utils/Nullable";

export default class Duration {
    startDateString: string;
    endDateString: Nullable2<string> = null;

    constructor(startDate: string) {
        this.startDateString = startDate;
    }
}