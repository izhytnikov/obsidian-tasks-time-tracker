import IPluginSettings from "./Settings/IPluginSettings";

export const DEFAULT_SETTINGS: IPluginSettings = {
    inProgressTaskStatusSymbol: "/",
    taskTypesSettings: [],
    dateLogs: {}
};

export const EVENTS = {
    DATAVIEW: {
        METADATA_CHANGE: "dataview:metadata-change",
        UPDATE: "update"
    },
    TASKS_TIME_TRACKER: {
        FILE_CHANGED: "tasks-time-tracker:file-changed"
    }
};

export const SUBPATHS_SEPARATOR_SYMBOL = ",";

export const EMPTY_STRING = "";

export const TASKS_TIME_TRACKER_CODE_BLOCK_NAME = "tasks-time-tracker";