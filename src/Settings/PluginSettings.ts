export type TaskPath = {
    path: string;
    subpaths: string[];
}

export default interface PluginSettings {
    mySetting: string;
    inProgressTaskStatusSymbol: string;
    taskPaths: TaskPath[];
}