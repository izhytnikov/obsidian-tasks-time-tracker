import Duration from "./Duration";

export default class TaskLog {
    public taskName: string;
    public durations: Duration[];

    public constructor(taskName: string, durations: Duration[]) {
        this.taskName = taskName;
        this.durations = durations;
    }
}