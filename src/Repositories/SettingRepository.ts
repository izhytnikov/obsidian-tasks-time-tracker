import { DateLogs } from "src/Settings/DateLogs";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";
import ISettingRepository from "./ISettingRepository";
import type IPluginSettings from "src/Settings/IPluginSettings";
import { Plugin } from "obsidian";
import { cloneDeep } from "lodash";
import TaskLog from "src/Settings/TaskLog";
import Interval from "src/Settings/Interval";
import { inject, injectable } from "tsyringe";

@injectable()
export default class SettingRepository implements ISettingRepository {
    #plugin: Plugin;
    #settings: IPluginSettings;

    public constructor(@inject("Plugin") plugin: Plugin,
        @inject("IPluginSettings") settings: IPluginSettings) {
        this.#settings = settings;
        this.#plugin = plugin;
    }

    public getInProgressTaskStatusSymbol(): string {
        return this.#settings.inProgressTaskStatusSymbol;
    }

    public getTaskTypesSettings(): TaskTypeSettings[] {
        return cloneDeep(this.#settings.taskTypesSettings);
    }

    public getDateLogs(): DateLogs {
        return cloneDeep(this.#settings.dateLogs);
    }

    public async updateInProgressTaskStatusSymbol(symbol: string): Promise<void> {
        this.#settings.inProgressTaskStatusSymbol = symbol;
        return this.#saveSettings();
    }

    public async updateTaskTypeSettings(taskTypeSettingsIndex: number, updatedTaskTypeSettings: TaskTypeSettings): Promise<void> {
        this.#settings.taskTypesSettings = this.#settings.taskTypesSettings.map((taskTypeSettings, index) => {
            if (index !== taskTypeSettingsIndex) {
                return taskTypeSettings;
            }

            return {
                ...taskTypeSettings,
                ...updatedTaskTypeSettings
            };
        });

        return this.#saveSettings();
    }

    public async updateTaskLogIntervalEndDate(dateLogKey: string, taskLogIndex: number, intervalIndex: number, endDateString: string): Promise<void> {
        const interval = this.#settings.dateLogs[dateLogKey]?.[taskLogIndex]?.intervals?.[intervalIndex] ?? null;

        if (interval !== null) {
            interval.endDateString = endDateString;
            return this.#saveSettings();
        }
    }

    public async addTaskTypeSettings(taskTypeSettings: TaskTypeSettings): Promise<void> {
        this.#settings.taskTypesSettings.push(taskTypeSettings);
        return this.#saveSettings();
    }

    public async addDateLog(dateLogKey: string, taskLogs: TaskLog[]): Promise<void> {
        this.#settings.dateLogs[dateLogKey] = taskLogs;
        return this.#saveSettings();
    }

    public async addTaskLog(dateLogKey: string, tasklog: TaskLog): Promise<void> {
        const dateLog = this.#settings.dateLogs[dateLogKey] ?? null;

        if (dateLog !== null) {
            dateLog.push(tasklog);
            return this.#saveSettings();   
        }
    }

    public async addTaskLogInterval(dateLogKey: string, taskLogIndex: number, interval: Interval): Promise<void> {
        const intervals = this.#settings.dateLogs[dateLogKey]?.[taskLogIndex]?.intervals ?? null;

        if (intervals !== null) {
            intervals.push(interval);
            return this.#saveSettings();
        }
    }

    public async deleteTaskTypeSettings(taskTypeSettingsIndex: number): Promise<void> {
        if (taskTypeSettingsIndex >= 0 && taskTypeSettingsIndex < this.#settings.taskTypesSettings.length) {
            this.#settings.taskTypesSettings = [
                ...this.#settings.taskTypesSettings.slice(0, taskTypeSettingsIndex),
                ...this.#settings.taskTypesSettings.slice(taskTypeSettingsIndex + 1)
            ];

            return this.#saveSettings();
        }
    }

    async #saveSettings(): Promise<void> {
        await this.#plugin.saveData(this.#settings);
    }
}