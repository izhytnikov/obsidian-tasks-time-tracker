import { MarkdownPostProcessorContext, Vault } from "obsidian";
import TimeTrackerRenderer from "src/Renderers/TimeTrackerRenderer";
import IPluginSettings from "src/Settings/IPluginSettings";

export default class TasksTimeTrackerCodeBlockProcessor {
    #settings: IPluginSettings;
    #vault: Vault;

    public constructor(settings: IPluginSettings, vault: Vault) {
        this.#settings = settings;
        this.#vault = vault;
    }

    public process(element: HTMLElement, context: MarkdownPostProcessorContext): void {
        const file = this.#vault.getFileByPath(context.sourcePath);
        if (file !== null) {
            const dateKey = new Date(`${file.basename}T00:00:00`).toDateString();
            const currentDateLog = this.#settings.dateLogs[dateKey]
            if (currentDateLog) {
                const child = new TimeTrackerRenderer(element, currentDateLog);
                context.addChild(child);
            }
        }
    }
}