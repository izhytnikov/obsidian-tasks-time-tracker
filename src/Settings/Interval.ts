import { Nullable } from "src/Utils/Nullable";

export default class Interval {
    public startDateString: string;
    public endDateString: Nullable<string> = null;

    public constructor(startDate: string) {
        this.startDateString = startDate;
    }
}