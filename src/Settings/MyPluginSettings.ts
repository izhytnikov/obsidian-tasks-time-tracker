export type TaskPath = {
    path: string;
    subpaths: string[];
}

export default interface MyPluginSettings {
    mySetting: string;
    inProgressTaskStatusSymbol: string;
    taskPaths: TaskPath[];
}