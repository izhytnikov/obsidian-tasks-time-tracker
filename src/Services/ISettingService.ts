import TaskLog from "src/Settings/TaskLog";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";
import { Nullable } from "src/Utils/Nullable";

export default interface ISettingService {
    getTaskLogsByDate(date: Date): Nullable<TaskLog[]>;
    getInProgressTaskStatusSymbol(): string;
    getTaskTypesSettings(): TaskTypeSettings[];
    addOrUpdateDateLog(date: Date, taskName: string, isTaskInProgress: boolean): Promise<void>;
    addTaskTypeSettings(taskTypeSettings: TaskTypeSettings): Promise<void>;
    updateInProgressTaskStatusSymbol(inProgressTaskStatusSymbol: string): Promise<void>;
    updateTaskTypeSettings(taskTypeSettingsIndex: number, taskTypeSettings: TaskTypeSettings): Promise<void>;
    deleteTaskTypeSettings(taskTypeSettingsIndex: number): Promise<void>;
}