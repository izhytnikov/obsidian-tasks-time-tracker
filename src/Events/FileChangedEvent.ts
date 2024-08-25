export default class FileChangedEvent {
    #fileName: string;
    #filePath: string;
    #hasFileInProgressTasks: boolean;

    constructor(fileName: string, filePath: string, hasInProgressTasks: boolean) {
        this.#fileName = fileName;
        this.#filePath = filePath;
        this.#hasFileInProgressTasks = hasInProgressTasks;
    }

    public getFileName(): string {
        return this.#fileName;
    }

    public getFilePath(): string {
        return this.#filePath;
    }

    public getHasFileInProgressTasks(): boolean {
        return this.#hasFileInProgressTasks;
    }
}