export class DateTaskLog {
    #date: Date;
    #isTaskInProgress: boolean;

    public constructor(date: Date, isTaskInProgress: boolean) {
        this.#date = date;
        this.#isTaskInProgress = isTaskInProgress;
    }

    public getDate(): Date {
        return this.#date;
    }

    public isTaskInProgress(): boolean {
        return this.#isTaskInProgress;
    }

    public setTaskInProgress(isTaskInProgress: boolean): void {
        this.#isTaskInProgress = isTaskInProgress;
    }
}

export default class FileChangedEvent {
    #fileName: string;
    #filePath: string;
    #dateTaskLogs: DateTaskLog[];

    public constructor(fileName: string, filePath: string, dateTaskLogs: DateTaskLog[]) {
        this.#fileName = fileName;
        this.#filePath = filePath;
        this.#dateTaskLogs = dateTaskLogs;
    }

    public getFileName(): string {
        return this.#fileName;
    }

    public getFilePath(): string {
        return this.#filePath;
    }

    public getDateTaskLogs(): DateTaskLog[] {
        return this.#dateTaskLogs;
    }
}