import { MarkdownPostProcessorContext, Vault } from "obsidian";
import TimeTrackerRenderer from "src/Renderers/TimeTrackerRenderer";
import PluginSettings from "src/Settings/PluginSettings";

export default class TasksTimeTrackerCodeBlockProcessor {
    #settings: PluginSettings;
    #vault: Vault;

    public constructor(settings: PluginSettings, vault: Vault) {
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