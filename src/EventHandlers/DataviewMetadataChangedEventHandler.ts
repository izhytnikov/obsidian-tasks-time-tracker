import { App, TFile } from "obsidian";
import IPluginSettings from "src/Settings/IPluginSettings";
import TaskRetrieverService from "src/Services/TaskRetrieverService";
import { EVENTS } from "src/Constants";
import FileChangedEvent from "src/Events/FileChangedEvent";
import DateTaskLog from "src/Events/DateTaskLog";

export default class DataviewMetadataChangedEventHandler {
    #app: App;
    #settings: IPluginSettings;
    #taskRetrieverService: TaskRetrieverService;

    public constructor(app: App, settings: IPluginSettings) {
        this.#app = app;
        this.#settings = settings;
        this.#taskRetrieverService = new TaskRetrieverService();
    }

    public handle(eventName: string, file: TFile): void {
        if (eventName === EVENTS.DATAVIEW.UPDATE) {
            this.#settings.taskPaths.forEach(taskPath => {
                if (file.path.startsWith(taskPath.path)) {
                    const tasks = this.#taskRetrieverService.getTasksBySubpaths(file.path, taskPath.subpaths);

                    const res = tasks.reduce((acc, task) => {
                        const scheduledDate = task.getScheduledDate();
                        if (scheduledDate === null) {
                            return acc;
                        }

                        const isCurrentTaskInProgress = task.getStatusSymbol() === this.#settings.inProgressTaskStatusSymbol;
                        const currVal = acc.find(log => log.getDate().getTime() === scheduledDate.getTime());
                        if (!currVal) {
                            acc.push(new DateTaskLog(scheduledDate, isCurrentTaskInProgress))
                            return acc;
                        }

                        currVal.setIsTaskInProgress(currVal.getIsTaskInProgress() || isCurrentTaskInProgress);
                        return acc;
                    }, [] as DateTaskLog[])

                    this.#app.vault.trigger(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, new FileChangedEvent(file.basename, file.path, res));
                }
            });
        }
    }
}