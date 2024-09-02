import Duration from "./Duration";

export default class TaskLog {
    taskName: string;
    durations: Duration[];

    constructor(taskName: string, durations: Duration[]) {
        this.taskName = taskName;
        this.durations = durations;
    }
}