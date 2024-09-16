import TaskLog from "src/Settings/TaskLog";
import ISettingService from "./ISettingService";
import type ISettingRepository from "src/Repositories/ISettingRepository";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";
import { Nullable } from "src/Utils/Nullable";
import Interval from "src/Settings/Interval";
import { inject, injectable } from "tsyringe";

@injectable()
export default class SettingService implements ISettingService {
    #settingRepository: ISettingRepository;

    public constructor(@inject("ISettingRepository") settingRepository: ISettingRepository) {
        this.#settingRepository = settingRepository;
    }

    public getTaskLogsByDate(date: Date): Nullable<TaskLog[]> {
        const logKey = this.#getDateLogKeyByDate(date);
        const dateLogs = this.#settingRepository.getDateLogs();
        return dateLogs[logKey] ?? null;
    }

    public getInProgressTaskStatusSymbol(): string {
        return this.#settingRepository.getInProgressTaskStatusSymbol();
    }

    public getTaskTypesSettings(): TaskTypeSettings[] {
        return this.#settingRepository.getTaskTypesSettings();
    }

    public async addOrUpdateDateLog(date: Date, taskName: string, isTaskInProgress: boolean): Promise<void> {
        const nowDate = new Date(Date.now()).toISOString();
        const logKey = this.#getDateLogKeyByDate(date);
        const taskLogs = this.getTaskLogsByDate(date);

        if (taskLogs === null) {
            if (isTaskInProgress) {
                this.#settingRepository.addDateLog(logKey, [new TaskLog(taskName, [new Interval(nowDate)])]);
            }
        } else {
            const taskLogIndex = taskLogs.findIndex(taskLog => taskLog.taskName === taskName);
            const taskLog = taskLogs[taskLogIndex];
            if (taskLog) {
                if (isTaskInProgress) {
                    if (taskLog.intervals.every(interval => interval.endDateString !== null)) {
                        this.#settingRepository.addTaskLogInterval(logKey, taskLogIndex, new Interval(nowDate));
                    }
                } else {
                    const inProgressIntervalIndex = taskLog.intervals.findIndex(interval => interval.endDateString === null);
                    if (inProgressIntervalIndex !== -1) {
                        this.#settingRepository.updateTaskLogIntervalEndDate(logKey, taskLogIndex, inProgressIntervalIndex, nowDate);
                    }
                }
            } else {
                if (isTaskInProgress) {
                    this.#settingRepository.addTaskLog(logKey, new TaskLog(taskName, [new Interval(nowDate)]));
                }
            }
        }
    }

    public addTaskTypeSettings(taskTypeSettings: TaskTypeSettings): Promise<void> {
        return this.#settingRepository.addTaskTypeSettings(taskTypeSettings);
    }

    public async updateInProgressTaskStatusSymbol(inProgressTaskStatusSymbol: string): Promise<void> {
        return this.#settingRepository.updateInProgressTaskStatusSymbol(inProgressTaskStatusSymbol);
    }

    public updateTaskTypeSettings(taskTypeSettingsIndex: number, taskTypeSettings: TaskTypeSettings): Promise<void> {
        return this.#settingRepository.updateTaskTypeSettings(taskTypeSettingsIndex, taskTypeSettings);
    }

    public async deleteTaskTypeSettings(taskTypeSettingsIndex: number): Promise<void> {
        return this.#settingRepository.deleteTaskTypeSettings(taskTypeSettingsIndex);
    }

    #getDateLogKeyByDate(date: Date): string {
        return date.toDateString();
    }
}