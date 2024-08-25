import { App, TFile } from "obsidian";
import PluginSettings from "src/Settings/PluginSettings";
import FileParser from "src/Parsers/FileParser";
import Task from "src/Parsers/Task";
import { EVENTS } from "src/Constants";
import FileChangedEvent from "src/Events/FileChangedEvent";

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
                    const inProgressTasks = tasks.filter((task: Task) => task.getStatusSymbol() === this.#settings.inProgressTaskStatusSymbol
                        && task.getScheduledDate() !== null);
                    this.#app.vault.trigger(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, new FileChangedEvent(file.basename, file.path, inProgressTasks.length !== 0));
                }
            });
        }
    }
}