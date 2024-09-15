
import { DateLogs } from "src/Settings/DateLogs";
import Interval from "src/Settings/Interval";
import TaskLog from "src/Settings/TaskLog";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";

export default interface ISettingRepository {
    getInProgressTaskStatusSymbol(): string;
    getTaskTypesSettings(): TaskTypeSettings[];
    getDateLogs(): DateLogs;
    updateInProgressTaskStatusSymbol(symbol: string): Promise<void>;
    updateTaskTypeSettings(taskTypeSettingsIndex: number, updatedTaskTypeSettings: TaskTypeSettings): Promise<void>;
    updateTaskLogIntervalEndDate(dateLogKey: string, taskLogIndex: number, intervalIndex: number, endDateString: string): Promise<void>;
    addTaskTypeSettings(taskTypeSettings: TaskTypeSettings): Promise<void>
    addDateLog(dateLogKey: string, taskLogs: TaskLog[]): Promise<void>;
    addTaskLog(dateLogKey: string, tasklog: TaskLog): Promise<void>;
    addTaskLogInterval(dateLogKey: string, taskLogIndex: number, interval: Interval): Promise<void>;
    deleteTaskTypeSettings(taskTypeSettingsIndex: number): Promise<void>;
}