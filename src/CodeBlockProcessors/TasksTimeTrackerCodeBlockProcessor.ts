import { MarkdownPostProcessorContext } from "obsidian";
import TimeTrackerRenderer from "src/Renderers/TimeTrackerRenderer";
import IFileService from "src/Services/IFileService";
import ISettingService from "src/Services/ISettingService";

export default class TasksTimeTrackerCodeBlockProcessor {
    #settingService: ISettingService;
    #fileService: IFileService;

    public constructor(settingService: ISettingService, fileService: IFileService) {
        this.#settingService = settingService;
        this.#fileService = fileService;
    }

    public process(element: HTMLElement, context: MarkdownPostProcessorContext): void {
        const file = this.#fileService.getFileByPath(context.sourcePath);
        if (file !== null) {
            const taskLogs = this.#settingService.getTaskLogsByDate(new Date(`${file.basename}T00:00:00`));
            if (taskLogs !== null) {
                const renderer = new TimeTrackerRenderer(element, taskLogs);
                context.addChild(renderer);
            }
        }
    }
}