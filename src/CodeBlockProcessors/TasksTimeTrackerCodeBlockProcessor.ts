import { MarkdownPostProcessorContext } from "obsidian";
import TimeTrackerRenderer from "src/Renderers/TimeTrackerRenderer";
import type IFileService from "src/Services/IFileService";
import type ISettingService from "src/Services/ISettingService";
import { inject, injectable } from "tsyringe";

@injectable()
export default class TasksTimeTrackerCodeBlockProcessor {
    #settingService: ISettingService;
    #fileService: IFileService;

    public constructor(@inject("ISettingService") settingService: ISettingService,
        @inject("IFileService") fileService: IFileService) {
        this.#settingService = settingService;
        this.#fileService = fileService;
    }

    public process(element: HTMLElement, context: MarkdownPostProcessorContext): void {
        const file = this.#fileService.getFileByPath(context.sourcePath);
        if (file !== null) {
            const renderer = new TimeTrackerRenderer(element, this.#settingService, new Date(`${file.basename}T00:00:00`));
            context.addChild(renderer);
        }
    }
}