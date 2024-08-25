import MyPluginSettings from "./Settings/MyPluginSettings";

export const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: "default",
    inProgressTaskStatusSymbol: "/",
    taskPaths: [
        { path: "Meetings", subpaths: ["Meeting-specific"] },
        { path: "Tasks/Specific", subpaths: ["General", "Task-specific"] }
    ]
}

export const EVENTS = {
    DATAVIEW: {
        METADATA_CHANGE: "dataview:metadata-change",
        UPDATE: "update"
    },
    TASKS_TIME_TRACKER: {
        FILE_CHANGED: "tasks-time-tracker:file-changed"
    }
}