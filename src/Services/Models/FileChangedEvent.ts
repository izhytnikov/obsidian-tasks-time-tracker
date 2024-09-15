import DateTaskLog from "./DateTaskLog";

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