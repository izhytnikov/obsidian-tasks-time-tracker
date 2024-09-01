import { MarkdownRenderChild, Vault } from "obsidian";

export default class TimeTrackerBlockRenderer extends MarkdownRenderChild {
    #vault: Vault;
    #contextFilePath: string;

    constructor(containerElement: HTMLElement, vault: Vault, contextFilePath: string) {
        super(containerElement);
        this.#vault = vault;
        this.#contextFilePath = contextFilePath;
    }

    onload() {
        this.containerEl.createEl("h2").textContent = "Timeline";
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
        console.log("updateContent");
        const now = new Date();
        timeElement.textContent = `Current time: ${now.toLocaleTimeString()}`;
    }
}