import { MarkdownRenderChild } from "obsidian";
import TaskLog from "src/Settings/TaskLog";
import { Nullable } from "src/Utils/Nullable";
import { EMPTY_STRING } from "src/Constants";
import ISettingService from "src/Services/ISettingService";
import Duration from "src/Services/Models/Duration";

export default class TimeTrackerRenderer extends MarkdownRenderChild {
    #settingService: ISettingService;
    #taskLogsDate: Date;
    #taskLogs: TaskLog[];
    #timeTrackerTable: HTMLTableElement;

    public constructor(containerElement: HTMLElement, settingService: ISettingService, taskLogsDate: Date) {
        super(containerElement);
        this.#settingService = settingService;
        this.#taskLogsDate = taskLogsDate;
    }

    public onload(): void {
        this.#timeTrackerTable = this.containerEl.createEl("table");
        this.registerInterval(window.setInterval(() => {
            this.#taskLogs = this.#settingService.getTaskLogsByDate(this.#taskLogsDate) ?? [];
            this.#drawTimeTrackerTable();
        }, 1000));
    }

    #drawTimeTrackerTable(): void {
        this.#deleteTimeTrackerTableRows();

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
                row.createEl("td", { text: this.#getTimeString(interval.startDateString) });
                row.createEl("td", { text: this.#getTimeString(interval.endDateString) });
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

    #deleteTimeTrackerTableRows(): void {
        while (this.#timeTrackerTable.rows.length > 0) {
            this.#timeTrackerTable.deleteRow(0);
        }
    }

    #getTimeString(dateString: Nullable<string>): string {
        return dateString !== null ? new Date(dateString).toLocaleTimeString([], { hour12: false }) : EMPTY_STRING;
    }
}