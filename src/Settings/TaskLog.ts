import Interval from "./Interval";

export default class TaskLog {
    public taskName: string;
    public intervals: Interval[];

    public constructor(taskName: string, intervals: Interval[]) {
        this.taskName = taskName;
        this.intervals = intervals;
    }
}