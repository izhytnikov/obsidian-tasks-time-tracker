import SettingRepository from "src/Repositories/SettingRepository";
import IPluginSettings from "src/Settings/IPluginSettings";
import { Plugin } from "../__mocks__/obsidian";
import { cloneDeep, isEqual } from "lodash";
import { EMPTY_STRING } from "src/Constants";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";
import TaskLog from "src/Settings/TaskLog";
import Interval from "src/Settings/Interval";

describe("getInProgressTaskStatusSymbol", () => {
    test("should return the in-progress task status symbol", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: "/",
            taskTypesSettings: [],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);

        // Act
        const inProgressTaskStatusSymbol = settingRepository.getInProgressTaskStatusSymbol();

        // Assert
        expect(inProgressTaskStatusSymbol).toBe(settings.inProgressTaskStatusSymbol);
    });
});
describe("getTaskTypesSettings", () => {
    test("should return a clone of the task types settings array", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [
                {
                    path: "Meetings",
                    subpaths: ["Meeting-specific"]
                },
                {
                    path: "Tasks/Specific",
                    subpaths: ["General", "Task-specific"]
                }
            ],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);

        // Act
        const taskTypesSettings = settingRepository.getTaskTypesSettings();
        const areValuesEqual = isEqual(taskTypesSettings, settings.taskTypesSettings);
        const areReferencesEqual = taskTypesSettings === settings.taskTypesSettings;

        // Assert
        expect(areValuesEqual).toBeTruthy();
        expect(areReferencesEqual).toBeFalsy();
    });
});
describe("getDateLogs", () => {
    test("should return a clone of the date logs object", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {
                "Fri Jul 19 2024": [
                    {
                        taskName: "Test meeting",
                        intervals: [
                            {
                                endDateString: "2024-09-16T14:38:44.561Z",
                                startDateString: "2024-09-16T14:38:40.474Z"
                            }
                        ]
                    }
                ]
            }
        };
        const settingRepository = new SettingRepository(plugin, settings);

        // Act
        const dateLogs = settingRepository.getDateLogs();
        const areValuesEqual = isEqual(dateLogs, settings.dateLogs);
        const areReferencesEqual = dateLogs === settings.dateLogs;

        // Assert
        expect(areValuesEqual).toBeTruthy();
        expect(areReferencesEqual).toBeFalsy();
    });
});
describe("updateInProgressTaskStatusSymbol", () => {
    test("should save the requested symbol to the settings", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const newSymbol = "+";

        // Act
        settingRepository.updateInProgressTaskStatusSymbol(newSymbol);

        // Assert
        expect(settings.inProgressTaskStatusSymbol).toEqual(newSymbol);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});
describe("updateTaskTypeSettings", () => {
    test("should not update the task type settings when a non-existing index is passed", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [
                {
                    path: "Meetings",
                    subpaths: ["Meeting-specific"]
                }
            ],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const updatedTaskTypeSettings: TaskTypeSettings = {
            path: "Meetings-updated",
            subpaths: ["Meeting-specific-updated"]
        };

        // Act
        settingRepository.updateTaskTypeSettings(-1, updatedTaskTypeSettings);

        // Assert
        expect(settings.taskTypesSettings[0]).not.toEqual(updatedTaskTypeSettings);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
    test("should update the task type settings when a existing index is passed", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [
                {
                    path: "Meetings",
                    subpaths: ["Meeting-specific"]
                }
            ],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const updatedTaskTypeSettings: TaskTypeSettings = {
            path: "Meetings-updated",
            subpaths: ["Meeting-specific-updated"]
        };

        // Act
        settingRepository.updateTaskTypeSettings(0, updatedTaskTypeSettings);

        // Assert
        expect(settings.taskTypesSettings[0]).toEqual(updatedTaskTypeSettings);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});
describe("updateTaskLogIntervalEndDate", () => {
    test("should not update the task log interval end date when a non-existing date log key is passed", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {
                [dateLogKey]: [
                    {
                        taskName: "Test meeting",
                        intervals: [
                            {
                                endDateString: "2024-09-16T14:38:44.561Z",
                                startDateString: "2024-09-16T14:38:40.474Z"
                            }
                        ]
                    }
                ]
            }
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const updatedEndDateString = "2025-09-16T14:38:44.561Z";
        // Act
        settingRepository.updateTaskLogIntervalEndDate("Fri Jul 19 2025", 0, 0, updatedEndDateString);

        // Assert
        expect(settings.dateLogs[dateLogKey][0].intervals[0].endDateString).not.toEqual(updatedEndDateString);
        expect(plugin.saveData).toHaveBeenCalledTimes(0);
    });
    test("should not update the task log interval end date when a non-existing task log index is passed", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {
                [dateLogKey]: [
                    {
                        taskName: "Test meeting",
                        intervals: [
                            {
                                endDateString: "2024-09-16T14:38:44.561Z",
                                startDateString: "2024-09-16T14:38:40.474Z"
                            }
                        ]
                    }
                ]
            }
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const updatedEndDateString = "2025-09-16T14:38:44.561Z";
        // Act
        settingRepository.updateTaskLogIntervalEndDate(dateLogKey, -1, 0, updatedEndDateString);

        // Assert
        expect(settings.dateLogs[dateLogKey][0].intervals[0].endDateString).not.toEqual(updatedEndDateString);
        expect(plugin.saveData).toHaveBeenCalledTimes(0);
    });
    test("should not update the task log interval end date when a non-existing interval index is passed", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {
                [dateLogKey]: [
                    {
                        taskName: "Test meeting",
                        intervals: [
                            {
                                endDateString: "2024-09-16T14:38:44.561Z",
                                startDateString: "2024-09-16T14:38:40.474Z"
                            }
                        ]
                    }
                ]
            }
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const updatedEndDateString = "2025-09-16T14:38:44.561Z";
        // Act
        settingRepository.updateTaskLogIntervalEndDate(dateLogKey, 0, -1, updatedEndDateString);

        // Assert
        expect(settings.dateLogs[dateLogKey][0].intervals[0].endDateString).not.toEqual(updatedEndDateString);
        expect(plugin.saveData).toHaveBeenCalledTimes(0);
    });
    test("should update the task log interval end date when a existing indexes are passed", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {
                [dateLogKey]: [
                    {
                        taskName: "Test meeting",
                        intervals: [
                            {
                                endDateString: "2024-09-16T14:38:44.561Z",
                                startDateString: "2024-09-16T14:38:40.474Z"
                            }
                        ]
                    }
                ]
            }
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const updatedEndDateString = "2025-09-16T14:38:44.561Z";
        // Act
        settingRepository.updateTaskLogIntervalEndDate(dateLogKey, 0, 0, updatedEndDateString);

        // Assert
        expect(settings.dateLogs[dateLogKey][0].intervals[0].endDateString).toEqual(updatedEndDateString);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});
describe("addTaskTypeSettings", () => {
    test("should add task type settings", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const taskTypeSettings: TaskTypeSettings = {
            path: "Meetings",
            subpaths: ["Meeting-specific"]
        };

        // Act
        settingRepository.addTaskTypeSettings(taskTypeSettings);

        // Assert
        expect(settings.taskTypesSettings[0]).toEqual(taskTypeSettings);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});
describe("addDateLog", () => {
    test("should add a date log if a date log with the requested key doesn't exist", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const dateLogKey = "Fri Jul 19 2024";
        const taskLogs: TaskLog[] = [
            {
                taskName: "Test meeting",
                intervals: [
                    {
                        endDateString: "2024-09-16T14:38:44.561Z",
                        startDateString: "2024-09-16T14:38:40.474Z"
                    }
                ]
            }
        ];

        // Act
        settingRepository.addDateLog(dateLogKey, taskLogs);

        // Assert
        expect(settings.dateLogs[dateLogKey]).toEqual(taskLogs);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
    test("should update a date log if a date log with the requested key exists", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {
                [dateLogKey]: [
                    {
                        taskName: "Test meeting",
                        intervals: [
                            {
                                endDateString: "2024-09-16T14:38:44.561Z",
                                startDateString: "2024-09-16T14:38:40.474Z"
                            }
                        ]
                    }
                ]
            }
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const taskLogs: TaskLog[] = [
            {
                taskName: "Test meeting-updated",
                intervals: [
                    {
                        endDateString: "2024-10-16T14:38:44.561Z",
                        startDateString: "2024-10-16T14:38:40.474Z"
                    }
                ]
            }
        ];

        // Act
        settingRepository.addDateLog(dateLogKey, taskLogs);

        // Assert
        expect(settings.dateLogs[dateLogKey]).toEqual(taskLogs);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});
describe("addTaskLog", () => {
    test("should not add a task log if a date log with the requested key doesn't exist", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const dateLogKey = "Fri Jul 19 2024";
        const taskLog: TaskLog = {
            taskName: "Test meeting",
            intervals: [
                {
                    endDateString: "2024-09-16T14:38:44.561Z",
                    startDateString: "2024-09-16T14:38:40.474Z"
                }
            ]
        };

        // Act
        settingRepository.addTaskLog(dateLogKey, taskLog);

        // Assert
        expect(settings.dateLogs).toEqual({});
        expect(plugin.saveData).toHaveBeenCalledTimes(0);
    });
    test("should add a task log if a date log with the requested key exists", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: { [dateLogKey]: [] }
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const taskLog: TaskLog = {
            taskName: "Test meeting",
            intervals: [
                {
                    endDateString: "2024-09-16T14:38:44.561Z",
                    startDateString: "2024-09-16T14:38:40.474Z"
                }
            ]
        };

        // Act
        settingRepository.addTaskLog(dateLogKey, taskLog);

        // Assert
        expect(settings.dateLogs[dateLogKey]).toEqual([taskLog]);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});
describe("addTaskLogInterval", () => {
    test("should not add a task log interval if the requested date log key doesn't exist", () => {
        // Arrange
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const dateLogKey = "Fri Jul 19 2024";
        const interval: Interval = {
            endDateString: "2024-09-16T14:38:44.561Z",
            startDateString: "2024-09-16T14:38:40.474Z"
        };

        // Act
        settingRepository.addTaskLogInterval(dateLogKey, 0, interval);

        // Assert
        expect(settings.dateLogs).toEqual({});
        expect(plugin.saveData).toHaveBeenCalledTimes(0);
    });
    test("should not add a task log interval if the requested task log index doesn't exist", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const dateLogs = {
            [dateLogKey]: [
                {
                    taskName: "Test meeting",
                    intervals: [
                        {
                            endDateString: "2024-09-16T14:38:44.561Z",
                            startDateString: "2024-09-16T14:38:40.474Z"
                        }
                    ]
                }
            ]
        };
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: cloneDeep(dateLogs)
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const interval: Interval = {
            endDateString: "2024-09-17T14:38:44.561Z",
            startDateString: "2024-09-17T14:38:40.474Z"
        };

        // Act
        settingRepository.addTaskLogInterval(dateLogKey, -1, interval);

        // Assert
        expect(settings.dateLogs).toEqual(dateLogs);
        expect(plugin.saveData).toHaveBeenCalledTimes(0);
    });
    test("should add a task log interval if the intervals array exist", () => {
        // Arrange
        const dateLogKey = "Fri Jul 19 2024";
        const plugin = new Plugin();
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: [],
            dateLogs: {
                [dateLogKey]: [
                    {
                        taskName: "Test meeting",
                        intervals: []
                    }
                ]
            }
        };
        const settingRepository = new SettingRepository(plugin, settings);
        const interval: Interval = {
            endDateString: "2024-09-17T14:38:44.561Z",
            startDateString: "2024-09-17T14:38:40.474Z"
        };

        // Act
        settingRepository.addTaskLogInterval(dateLogKey, 0, interval);

        // Assert
        expect(settings.dateLogs[dateLogKey][0].intervals[0]).toEqual(interval);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});
describe("deleteTaskTypeSettings", () => {
    test("should not delete task type settings if the task type settings index doesn't exist", () => {
        // Arrange
        const plugin = new Plugin();
        const taskTypesSettings = [
            {
                path: "Meetings",
                subpaths: ["Meeting-specific"]
            }
        ];
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: cloneDeep(taskTypesSettings),
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);

        // Act
        settingRepository.deleteTaskTypeSettings(1);

        // Assert
        expect(settings.taskTypesSettings).toEqual(taskTypesSettings);
        expect(plugin.saveData).toHaveBeenCalledTimes(0);
    });
    test("should delete task type settings if the task type settings index exists", () => {
        // Arrange
        const plugin = new Plugin();
        const taskTypesSettings = [
            {
                path: "Meetings",
                subpaths: ["Meeting-specific"]
            }
        ];
        const settings: IPluginSettings = {
            inProgressTaskStatusSymbol: EMPTY_STRING,
            taskTypesSettings: cloneDeep(taskTypesSettings),
            dateLogs: {}
        };
        const settingRepository = new SettingRepository(plugin, settings);

        // Act
        settingRepository.deleteTaskTypeSettings(0);

        // Assert
        expect(settings.taskTypesSettings).toEqual([]);
        expect(plugin.saveData).toHaveBeenNthCalledWith(1, settings);
    });
});