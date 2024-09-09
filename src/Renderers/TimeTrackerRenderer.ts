import { MarkdownRenderChild } from "obsidian";
import Duration from "src/Settings/Duration";
import TaskLog from "src/Settings/TaskLog";
import { Nullable } from "src/Utils/Nullable";
import Interval from "./Interval";

export default class TimeTrackerRenderer extends MarkdownRenderChild {
    #taskLogs: TaskLog[];
    #table: HTMLTableElement;

    public constructor(containerElement: HTMLElement, taskLogs: TaskLog[]) {
        super(containerElement);
        this.#taskLogs = taskLogs;
    }

    public onload(): void {
        this.#table = this.containerEl.createEl('table');
        this.registerInterval(window.setInterval(() => {
            this.drawTable();
        }, 1000));
    }

    private drawTable(): void {
        while (this.#table.rows.length > 0) {
            this.#table.deleteRow(0);
        }
        // Create the header row
        const headerRow = this.#table.createEl('tr');
        headerRow.createEl('th', { text: 'Task' });
        headerRow.createEl('th', { text: 'Start' });
        headerRow.createEl('th', { text: 'End' });
        headerRow.createEl('th', { text: 'Duration' });
        headerRow.createEl('th', { text: 'Task total' });
        headerRow.createEl('th', { text: 'Total' });

        let wholeDayDuration = 0;
        let wholeDayTotalCell: HTMLTableCellElement;
        this.#taskLogs.forEach((taskLog, taskLogIndex) => {
            let taskDuration = 0;
            let taskTotalCell: HTMLTableCellElement;

            taskLog.durations.forEach((duration, durationIndex) => {
                const durationDiffSeconds = this.getDurationDiffSeconds(duration);
                const interval = this.getIntervalFromSeconds(durationDiffSeconds);
                taskDuration += durationDiffSeconds;
                wholeDayDuration += durationDiffSeconds;

                const row = this.#table.createEl('tr');
                if (durationIndex === 0) {
                    row.createEl('td', { text: taskLog.taskName, attr: { rowspan: taskLog.durations.length.toString() } });
                }
                row.createEl('td', { text: this.getTimeString(duration.startDateString) });
                row.createEl('td', { text: this.getTimeString(duration.endDateString) });
                row.createEl('td', { text: interval.toString() });
                if (durationIndex === 0) {
                    taskTotalCell = row.createEl('td', { attr: { rowspan: taskLog.durations.length.toString() } });
                    if (taskLogIndex === 0) {
                        wholeDayTotalCell = row.createEl('td', { attr: { rowspan: '0' } });
                    }
                }
                if (durationIndex === taskLog.durations.length - 1 && taskTotalCell) {
                    taskTotalCell.innerText = this.getIntervalFromSeconds(taskDuration).toString();
                }
            })

            if (taskLogIndex === this.#taskLogs.length - 1 && wholeDayTotalCell) {
                wholeDayTotalCell.innerText = this.getIntervalFromSeconds(wholeDayDuration).toString();
            }
        })
    }

    private getTimeString(dateString: Nullable<string>): string {
        return dateString !== null ? new Date(dateString).toLocaleTimeString([], { hour12: false }) : "";
    }

    private getIntervalFromSeconds(seconds: number): Interval {
        const hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;

        const minutes = Math.floor(seconds / 60) % 60;
        seconds -= minutes * 60;

        seconds = Math.ceil(seconds % 60);

        return new Interval(hours, minutes, seconds);
    }

    private getDurationDiffSeconds(duration: Duration): number {
        const fromDate = new Date(duration.startDateString);
        const toDate = duration.endDateString !== null ? new Date(duration.endDateString) : new Date(Date.now());
        const diff = toDate.getTime() - fromDate.getTime();


        // get total seconds between the times
        return diff / 1000;
    }
}