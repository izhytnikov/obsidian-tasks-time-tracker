import { MarkdownRenderChild, Vault } from "obsidian";
import TaskLog from "src/Settings/TaskLog";

export default class TimeTrackerBlockRenderer extends MarkdownRenderChild {
    #taskLogs: TaskLog[];
    #contextFilePath: string;

    constructor(containerElement: HTMLElement, taskLogs: TaskLog[]) {
        super(containerElement);
        this.#taskLogs = taskLogs;
    }

    onload() {
        this.containerEl.createEl("p").textContent = "Timeline";
        const staticElement = this.containerEl.createEl('div');
        staticElement.textContent = `${this.#contextFilePath}`;

        // Create an element to display the time
        const timeElement = this.containerEl.createEl('div');
        this.updateContent(timeElement);

        // Update the content every second
        this.registerInterval(window.setInterval(() => {
            this.updateContent(timeElement);
        }, 1000));

    }

    private updateContent(timeElement: HTMLElement) {
        const now = new Date();
        timeElement.textContent = `Current time: ${now.toLocaleTimeString()}`;
    }
}