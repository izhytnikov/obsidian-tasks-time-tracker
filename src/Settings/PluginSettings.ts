import { Nullable2 } from "src/Utils/Nullable";

export type TaskPath = {
    path: string;
    subpaths: string[];
}

export class Duration {
    startDate: Date;
    endDate: Nullable2<Date>;

    constructor(startDate: Date, endDate: Nullable2<Date> = null) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public isInProgress(): boolean {
        return this.endDate === null;
    }

    public setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }
}

export class TaskLog {
    taskName: string;
    durations: Duration[];

    constructor(taskName: string, durations: Duration[]) {
        this.taskName = taskName;
        this.durations = durations;
    }
}

export type DateLog = {
    [key: string]: TaskLog[];
}

export default interface PluginSettings {
    mySetting: string;
    inProgressTaskStatusSymbol: string;
    taskPaths: TaskPath[];
    dailyNoteDateFormat: string;
    dailyNotesPath: string;
    dateLogs: DateLog;
}