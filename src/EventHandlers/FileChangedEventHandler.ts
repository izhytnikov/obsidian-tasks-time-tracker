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
        event.getDateTaskLog().forEach(log => {
            const nowDate = new Date(Date.now()).toISOString();
            const key = log.getDate().toDateString();
            const fileName = event.getFileName();

            const currentDateLog = this.#settings.dateLogs[key];
            if (!currentDateLog) {
                if (log.getIsTaskInProgress()) {
                    this.#settings.dateLogs[key] = [new TaskLog(fileName, [new Interval(nowDate)])];
                }
            } else {
                const taskLog = currentDateLog.find(taskLog => taskLog.taskName === event.getFileName());
                if (taskLog) {
                    if (log.getIsTaskInProgress()) {
                        if (taskLog.durations.every(duration => duration.endDateString !== null)) {
                            taskLog.durations.push(new Interval(nowDate));
                        }
                    } else {
                        const inProgressTask = taskLog.durations.find(duration => duration.endDateString === null);
                        if (inProgressTask) {
                            inProgressTask.endDateString = nowDate;
                        }
                    }
                } else {
                    if (log.getIsTaskInProgress()) {
                        currentDateLog.push(new TaskLog(fileName, [new Interval(nowDate)]))
                    }
                }
            }
        })

        await this.#plugin.saveSettings();
    }
}