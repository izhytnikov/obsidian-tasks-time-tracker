
import { TaskPath } from "./TaskPath";
import { DateLog } from "./DateLog";

export default interface PluginSettings {
    inProgressTaskStatusSymbol: string;
    taskPaths: TaskPath[];
    dailyNoteDateFormat: string;
    dateLogs: DateLog;
}