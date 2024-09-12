import { App, TFile } from "obsidian";
import IPluginSettings from "src/Settings/IPluginSettings";
import TaskRetrieverService from "src/Services/TaskRetrieverService";
import { EVENTS } from "src/Constants";
import FileChangedEvent, { DateTaskLog } from "src/Events/FileChangedEvent";

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
            this.#settings.taskTypesSettings.forEach(taskPath => {
                if (taskPath.path !== null && file.path.startsWith(taskPath.path)) {
                    const tasks = this.#taskRetrieverService.getTasksBySubpaths(file.path, taskPath.subpaths);
                    const dateTaskLogs = tasks.reduce((accumulator, task) => {
                        const taskScheduledDate = task.getScheduledDate();
                        if (taskScheduledDate === null) {
                            return accumulator;
                        }

                        const isTaskInProgress = task.getStatusSymbol() === this.#settings.inProgressTaskStatusSymbol;
                        const dateTaskLog = accumulator.find(dateTaskLog => dateTaskLog.getDate().getTime() === taskScheduledDate.getTime());
                        if (!dateTaskLog) {
                            accumulator.push(new DateTaskLog(taskScheduledDate, isTaskInProgress))
                        } else {
                            dateTaskLog.setTaskInProgress(dateTaskLog.isTaskInProgress() || isTaskInProgress);
                        }

                        return accumulator;
                    }, [] as DateTaskLog[])

                    this.#app.vault.trigger(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, new FileChangedEvent(file.basename, file.path, dateTaskLogs));
                }
            });
        }
    }
}