export default class DateTaskLog {
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