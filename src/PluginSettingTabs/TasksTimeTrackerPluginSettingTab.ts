import TasksTimeTrackerPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { EMPTY_STRING, SUBPATHS_SEPARATOR_SYMBOL } from "src/Constants";
import TaskTypeSettingsModal from "src/Modals/TaskTypeSettingsModal";
import IPluginSettings from "src/Settings/IPluginSettings";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";
import { ActionWithParameter } from "src/Utils/Delegates";
import { Nullable } from "src/Utils/Nullable";

export default class TasksTimeTrackerPluginSettingTab extends PluginSettingTab {
    #plugin: TasksTimeTrackerPlugin;
    #settings: IPluginSettings;

    public constructor(app: App, plugin: TasksTimeTrackerPlugin, settings: IPluginSettings) {
        super(app, plugin);
        this.#plugin = plugin;
        this.#settings = settings;
    }

    public display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
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

        new Setting(containerEl)
            .setName("Task types")
            .setDesc("A single task type contains the file path where tasks are stored and a list of file headers that organize the tasks.")
            .addExtraButton((button) => {
                button.setIcon("plus-circle")
                    .setTooltip("Add a new task type")
                    .onClick(() => this.openCreateTaskTypeSettingsModal())
            });

        this.#settings.taskTypesSettings.forEach((taskTypeSettings, index) => {
            new Setting(containerEl)
                .setName(taskTypeSettings.path ?? EMPTY_STRING)
                .setDesc(taskTypeSettings.subpaths.join(`${SUBPATHS_SEPARATOR_SYMBOL} `))
                .addExtraButton((button) => {
                    button.setIcon("edit")
                        .setTooltip("Edit a task type")
                        .onClick(() => this.openEditTaskTypeSettingsModal(taskTypeSettings))
                })
                .addExtraButton((button) => {
                    button.setIcon("trash")
                        .setTooltip("Delete a task type")
                        .onClick(async () => {
                            this.#settings.taskTypesSettings = [
                                ...this.#settings.taskTypesSettings.slice(0, index),
                                ...this.#settings.taskTypesSettings.slice(index + 1)
                            ];
                            await this.#plugin.saveSettings();
                            this.display();
                        })
                });
        })
    }

    private openCreateTaskTypeSettingsModal(): void {
        return this.openTaskTypeSettingsModal(
            "Create a task type",
            async (taskTypeSettings) => {
                this.#settings.taskTypesSettings.push(taskTypeSettings);
                await this.#plugin.saveSettings();
            },
            new TaskTypeSettings()
        );
    }

    private openEditTaskTypeSettingsModal(taskTypeSettings: TaskTypeSettings): void {
        return this.openTaskTypeSettingsModal(
            "Edit a task type",
            async (_) => await this.#plugin.saveSettings(),
            taskTypeSettings
        );
    }

    private openTaskTypeSettingsModal(modalHeaderText: string, onSubmitCallback: ActionWithParameter<TaskTypeSettings>, taskTypeSettings: Nullable<TaskTypeSettings>): void {
        new TaskTypeSettingsModal(
            this.#plugin.app,
            modalHeaderText,
            onSubmitCallback,
            () => this.display(),
            taskTypeSettings ?? new TaskTypeSettings()
        ).open();
    }
}