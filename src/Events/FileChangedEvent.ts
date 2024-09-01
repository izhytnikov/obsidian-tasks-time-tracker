
export class DateTaskLog {
    date: Date;
    isTaskInProgress: boolean;

    constructor(date: Date, isTaskInProgress: boolean) {
        this.date = date;
        this.isTaskInProgress = isTaskInProgress;
    }

    public getDate(): Date {
        return this.date;
    }

    public getIsTaskInProgress(): boolean {
        return this.isTaskInProgress;
    }

    public setIsTaskInProgress(isTaskInProgress: boolean): void {
        this.isTaskInProgress = isTaskInProgress;
    }
};

export default class FileChangedEvent {
    fileName: string;
    filePath: string;
    dateTaskLogs: DateTaskLog[];

    constructor(fileName: string, filePath: string, dateTaskLogs: DateTaskLog[]) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.dateTaskLogs = dateTaskLogs;
    }

    public getFileName(): string {
        return this.fileName;
    }

    public getFilePath(): string {
        return this.filePath;
    }

    public getDateTaskLog(): DateTaskLog[] {
        return this.dateTaskLogs;
    }
}