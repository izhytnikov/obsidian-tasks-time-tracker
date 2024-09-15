import { MarkdownRenderChild } from "obsidian";
import TaskLog from "src/Settings/TaskLog";
import { Nullable } from "src/Utils/Nullable";
import Interval from "src/Settings/Interval";
import { EMPTY_STRING } from "src/Constants";

export class Duration {
    #hours: number;
    #minutes: number;
    #seconds: number;

    public constructor(hours: number, minutes: number, seconds: number) {
        this.#hours = hours;
        this.#minutes = minutes;
        this.#seconds = seconds;
    }

    public getHours(): number {
        return this.#hours;
    }

    public getMinutes(): number {
        return this.#minutes;
    }

    public getSeconds(): number {
        return this.#seconds;
    }

    public add(duration: Duration): void {
        const totalSeconds = this.#seconds + duration.getSeconds();
        const totalMinutes = this.#minutes + duration.getMinutes() + Math.floor(totalSeconds / 60);
        const totalHours = this.#hours + duration.getHours() + Math.floor(totalMinutes / 60);

        this.#seconds = totalSeconds % 60;
        this.#minutes = totalMinutes % 60;
        this.#hours = totalHours;
    }

    public toString(): string {
        return `${this.#hours.toString().padStart(2, "0")}:${this.#minutes.toString().padStart(2, "0")}:${this.#seconds.toString().padStart(2, "0")}`;
    }

    public static fromInterval(interval: Interval): Duration {
        const startDate = new Date(interval.startDateString);
        const endDate = interval.endDateString !== null
            ? new Date(interval.endDateString)
            : new Date(Date.now());

        const durationMilliseconds = endDate.getTime() - startDate.getTime();
        let durationSeconds = durationMilliseconds / 1000;

        const durationHours = Math.floor(durationSeconds / 3600);
        durationSeconds -= durationHours * 3600;

        const durationMinutes = Math.floor(durationSeconds / 60) % 60;
        durationSeconds -= durationMinutes * 60;

        durationSeconds = Math.ceil(durationSeconds % 60);

        return new Duration(durationHours, durationMinutes, durationSeconds);
    }
}

export default class TimeTrackerRenderer extends MarkdownRenderChild {
    #taskLogs: TaskLog[];
    #timeTrackerTable: HTMLTableElement;

    public constructor(containerElement: HTMLElement, taskLogs: TaskLog[]) {
        super(containerElement);
        this.#taskLogs = taskLogs;
    }

    public onload(): void {
        this.#timeTrackerTable = this.containerEl.createEl("table");
        this.registerInterval(window.setInterval(() => {
            this.drawTimeTrackerTable();
        }, 1000));
    }

    private drawTimeTrackerTable(): void {
        this.deleteTimeTrackerTableRows();

        const headerRow = this.#timeTrackerTable.createEl("tr");
        headerRow.createEl("th", { text: "Task" });
        headerRow.createEl("th", { text: "Start" });
        headerRow.createEl("th", { text: "End" });
        headerRow.createEl("th", { text: "Duration" });
        headerRow.createEl("th", { text: "Task duration" });
        headerRow.createEl("th", { text: "Total duration" });

        const dayDuration = new Duration(0, 0, 0);
        let dayDurationCell: HTMLTableCellElement;
        this.#taskLogs.forEach((taskLog, taskLogIndex) => {
            const taskDuration = new Duration(0, 0, 0);
            let taskDurationCell: HTMLTableCellElement;

            taskLog.intervals.forEach((interval, intervalIndex) => {
                const intervalDuration = Duration.fromInterval(interval);
                taskDuration.add(intervalDuration);
                dayDuration.add(intervalDuration);

                const row = this.#timeTrackerTable.createEl("tr");
                if (intervalIndex === 0) {
                    row.createEl("td", { text: taskLog.taskName, attr: { rowspan: taskLog.intervals.length.toString() } });
                }
                row.createEl("td", { text: this.getTimeString(interval.startDateString) });
                row.createEl("td", { text: this.getTimeString(interval.endDateString) });
                row.createEl("td", { text: intervalDuration.toString() });
                if (intervalIndex === 0) {
                    taskDurationCell = row.createEl("td", { attr: { rowspan: taskLog.intervals.length.toString() } });
                    if (taskLogIndex === 0) {
                        dayDurationCell = row.createEl("td", { attr: { rowspan: "0" } });
                    }
                }
                if (intervalIndex === taskLog.intervals.length - 1 && taskDurationCell) {
                    taskDurationCell.innerText = taskDuration.toString();
                }
            });

            if (taskLogIndex === this.#taskLogs.length - 1 && dayDurationCell) {
                dayDurationCell.innerText = dayDuration.toString();
            }
        });
    }

    private deleteTimeTrackerTableRows(): void {
        while (this.#timeTrackerTable.rows.length > 0) {
            this.#timeTrackerTable.deleteRow(0);
        }
    }

    private getTimeString(dateString: Nullable<string>): string {
        return dateString !== null ? new Date(dateString).toLocaleTimeString([], { hour12: false }) : EMPTY_STRING;
    }
}