
import { TaskPath } from "./TaskPath";
import { DateLog } from "./DateLog";

export default interface PluginSettings {
    mySetting: string;
    inProgressTaskStatusSymbol: string;
    taskPaths: TaskPath[];
    dailyNoteDateFormat: string;
    dailyNotesPath: string;
    dateLogs: DateLog;
}