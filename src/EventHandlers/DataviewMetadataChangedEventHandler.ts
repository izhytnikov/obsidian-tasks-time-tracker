import { App, TFile } from "obsidian";
import PluginSettings from "src/Settings/PluginSettings";
import FileParser from "src/Parsers/FileParser";
import { EVENTS } from "src/Constants";
import FileChangedEvent from "src/Events/FileChangedEvent";
import DateTaskLog from "src/Events/DateTaskLog";

export default class DataviewMetadataChangedEventHandler {
    #app: App;
    #settings: PluginSettings;
    #fileParser: FileParser;

    public constructor(app: App, settings: PluginSettings) {
        this.#app = app;
        this.#settings = settings;
        this.#fileParser = new FileParser();
    }

    public handle(eventName: string, file: TFile): void {
        if (eventName === EVENTS.DATAVIEW.UPDATE) {
            this.#settings.taskPaths.forEach(taskPath => {
                if (file.path.startsWith(taskPath.path)) {
                    const tasks = this.#fileParser.getTasksBySubpaths(file.path, taskPath.subpaths);

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