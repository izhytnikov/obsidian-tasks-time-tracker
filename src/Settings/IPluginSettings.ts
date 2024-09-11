
import { TaskPath } from "./TaskPath";
import { DateLogs } from "./DateLogs";

export default interface IPluginSettings {
    inProgressTaskStatusSymbol: string;
    taskPaths: TaskPath[];
    dateLogs: DateLogs;
}