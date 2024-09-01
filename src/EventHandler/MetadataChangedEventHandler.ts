import { App, TFile } from "obsidian";
import PluginSettings from "src/Settings/PluginSettings";
import FileParser from "src/Parsers/FileParser";
import Task from "src/Parsers/Task";
import { EVENTS } from "src/Constants";
import FileChangedEvent, { DateTaskLog } from "src/Events/FileChangedEvent";
import { group } from "console";

export default class MetadataChangedEventHandler {
    #app: App;
    #settings: PluginSettings;
    #fileParser: FileParser;

    constructor(app: App, settings: PluginSettings) {
        this.#app = app;
        this.#settings = settings;
        this.#fileParser = new FileParser();
    }

    handle(eventName: string, file: TFile) {
        if (eventName === EVENTS.DATAVIEW.UPDATE) {
            this.#settings.taskPaths.forEach(taskPath => {
                if (file.path.startsWith(taskPath.path)) {
                    const tasks = this.#fileParser.getTasksBySubpaths(file.path, taskPath.subpaths);

                    const res = tasks.reduce((acc, task) => {
                        if (!task.getScheduledDate().hasValue()) {
                            return acc;
                        }

                        const date = task.getScheduledDate().getValue()!;
                        const isCurrentTaskInProgress = task.getStatusSymbol() === this.#settings.inProgressTaskStatusSymbol;
                        const currVal = acc.find(log => log.getDate().getTime() === date.getTime());
                        if (!currVal) {
                            acc.push(new DateTaskLog(date, isCurrentTaskInProgress))
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