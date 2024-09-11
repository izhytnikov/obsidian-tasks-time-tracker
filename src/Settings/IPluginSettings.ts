
import { TaskTypeSettings } from "./TaskTypeSettings";
import { DateLogs } from "./DateLogs";

export default interface IPluginSettings {
    inProgressTaskStatusSymbol: string;
    taskTypesSettings: TaskTypeSettings[];
    dateLogs: DateLogs;
}