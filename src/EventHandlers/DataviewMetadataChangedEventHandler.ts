import { TFile } from "obsidian";
import { EVENTS } from "src/Constants";
import ITaskService from "src/Services/ITaskService";
import DateTaskLog from "src/Services/Models/DateTaskLog";
import FileChangedEvent from "src/Services/Models/FileChangedEvent";
import IEventService from "src/Services/IEventService";
import ISettingService from "src/Services/ISettingService";

export default class DataviewMetadataChangedEventHandler {
    #taskService: ITaskService;
    #eventService: IEventService;
    #settingService: ISettingService;

    public constructor(taskService: ITaskService, eventService: IEventService, settingService: ISettingService) {
        this.#taskService = taskService;
        this.#eventService = eventService;
        this.#settingService = settingService;
    }

    public handle(eventName: string, file: TFile): void {
        if (eventName === EVENTS.DATAVIEW.UPDATE) {
            this.#settingService.getTaskTypesSettings().forEach(taskPath => {
                if (taskPath.path !== null && file.path.startsWith(taskPath.path)) {
                    const tasks = this.#taskService.getScheduledTasksBySubpaths(file.path, taskPath.subpaths);
                    const dateTaskLogs = tasks.reduce((accumulator, task) => {
                        const taskScheduledDate = task.getScheduledDate();
                        const isTaskInProgress = task.hasStatusSymbol(this.#settingService.getInProgressTaskStatusSymbol());
                        const dateTaskLog = accumulator.find(dateTaskLog => dateTaskLog.getDate().getTime() === taskScheduledDate.getTime());
                        if (!dateTaskLog) {
                            accumulator.push(new DateTaskLog(taskScheduledDate, isTaskInProgress));
                        } else {
                            dateTaskLog.setTaskInProgress(dateTaskLog.isTaskInProgress() || isTaskInProgress);
                        }

                        return accumulator;
                    }, [] as DateTaskLog[]);

                    this.#eventService.triggerFileChangedEvent(new FileChangedEvent(file.basename, file.path, dateTaskLogs));
                }
            });
        }
    }
}