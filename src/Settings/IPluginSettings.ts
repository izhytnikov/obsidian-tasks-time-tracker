
import { TaskPath } from "./TaskPath";
import { DateLog } from "./DateLog";

export default interface IPluginSettings {
    inProgressTaskStatusSymbol: string;
    taskPaths: TaskPath[];
    dateLogs: DateLog;
}