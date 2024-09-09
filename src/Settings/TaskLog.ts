import Interval from "./Interval";

export default class TaskLog {
    public taskName: string;
    public durations: Interval[];

    public constructor(taskName: string, durations: Interval[]) {
        this.taskName = taskName;
        this.durations = durations;
    }
}