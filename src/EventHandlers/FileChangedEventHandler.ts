import TasksTimeTrackerPlugin from "main";
import FileChangedEvent from "src/Events/FileChangedEvent";
import Interval from "src/Settings/Interval";
import IPluginSettings from "src/Settings/IPluginSettings";
import TaskLog from "src/Settings/TaskLog";

export default class FileChangedEventHandler {
    #settings: IPluginSettings;
    #plugin: TasksTimeTrackerPlugin;

    public constructor(settings: IPluginSettings, plugin: TasksTimeTrackerPlugin) {
        this.#settings = settings;
        this.#plugin = plugin;
    }

    public async handle(event: FileChangedEvent): Promise<void> {
        event.getDateTaskLogs().forEach(dateTaskLog => {
            const nowDate = new Date(Date.now()).toISOString();
            const logKey = dateTaskLog.getDate().toDateString();
            const fileName = event.getFileName();

            const dateLog = this.#settings.dateLogs[logKey];
            if (!dateLog) {
                if (dateTaskLog.isTaskInProgress()) {
                    this.#settings.dateLogs[logKey] = [new TaskLog(fileName, [new Interval(nowDate)])];
                }
            } else {
                const taskLog = dateLog.find(taskLog => taskLog.taskName === event.getFileName());
                if (taskLog) {
                    if (dateTaskLog.isTaskInProgress()) {
                        if (taskLog.intervals.every(interval => interval.endDateString !== null)) {
                            taskLog.intervals.push(new Interval(nowDate));
                        }
                    } else {
                        const inProgressInterval = taskLog.intervals.find(interval => interval.endDateString === null);
                        if (inProgressInterval) {
                            inProgressInterval.endDateString = nowDate;
                        }
                    }
                } else {
                    if (dateTaskLog.isTaskInProgress()) {
                        dateLog.push(new TaskLog(fileName, [new Interval(nowDate)]))
                    }
                }
            }
        })

        await this.#plugin.saveSettings();
    }
}