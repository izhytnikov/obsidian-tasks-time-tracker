import TasksTimeTrackerPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import IPluginSettings from "src/Settings/IPluginSettings";

export default class InProgressTaskStatusSymbolPluginSettingTab extends PluginSettingTab {
    #plugin: TasksTimeTrackerPlugin;
    #settings: IPluginSettings;

    public constructor(app: App, plugin: TasksTimeTrackerPlugin, settings: IPluginSettings) {
        super(app, plugin);
        this.#plugin = plugin;
        this.#settings = settings;
    }

    public display(): void {
        const { containerEl: containerElement } = this;

        containerElement.empty();

        new Setting(containerElement)
            .setName("In-progress task status symbol")
            .setDesc("Represents the symbol used to indicate the status of tasks that are currently in progress.")
            .addText((text) =>
                text.setPlaceholder("/")
                    .setValue(this.#settings.inProgressTaskStatusSymbol)
                    .onChange(async (value) => {
                        this.#settings.inProgressTaskStatusSymbol = value;
                        await this.#plugin.saveSettings();
                    })
            );
    }
}