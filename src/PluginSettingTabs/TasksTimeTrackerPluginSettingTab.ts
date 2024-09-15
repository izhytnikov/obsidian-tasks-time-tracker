import TasksTimeTrackerPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { EMPTY_STRING, SUBPATHS_SEPARATOR_SYMBOL } from "src/Constants";
import TaskTypeSettingsModal from "src/Modals/TaskTypeSettingsModal";
import ISettingService from "src/Services/ISettingService";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";
import { ActionWithParameter } from "src/Utils/Delegates";

export default class TasksTimeTrackerPluginSettingTab extends PluginSettingTab {
    #plugin: TasksTimeTrackerPlugin;
    #settingService: ISettingService;

    public constructor(app: App, plugin: TasksTimeTrackerPlugin, settingService: ISettingService) {
        super(app, plugin);
        this.#plugin = plugin;
        this.#settingService = settingService;
    }

    public display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("In-progress task status symbol")
            .setDesc("Represents the symbol used to indicate the status of tasks that are currently in progress.")
            .addText((text) =>
                text.setPlaceholder("/")
                    .setValue(this.#settingService.getInProgressTaskStatusSymbol())
                    .onChange(async (value) => this.#settingService.updateInProgressTaskStatusSymbol(value))
            );

        new Setting(containerEl)
            .setName("Task types")
            .setDesc("A single task type contains the file path where tasks are stored and a list of file headers that organize the tasks.")
            .addExtraButton((button) => {
                button.setIcon("plus-circle")
                    .setTooltip("Add a new task type")
                    .onClick(() => this.openCreateTaskTypeSettingsModal())
            });

        this.#settingService.getTaskTypesSettings().forEach((taskTypeSettings, index) => {
            new Setting(containerEl)
                .setName(taskTypeSettings.path ?? EMPTY_STRING)
                .setDesc(taskTypeSettings.subpaths.join(`${SUBPATHS_SEPARATOR_SYMBOL} `))
                .addExtraButton((button) => {
                    button.setIcon("edit")
                        .setTooltip("Edit a task type")
                        .onClick(() => this.openEditTaskTypeSettingsModal(index, taskTypeSettings))
                })
                .addExtraButton((button) => {
                    button.setIcon("trash")
                        .setTooltip("Delete a task type")
                        .onClick(async () => {
                            this.#settingService.deleteTaskTypeSettings(index);
                            this.display();
                        })
                });
        })
    }

    private openCreateTaskTypeSettingsModal(): void {
        return this.openTaskTypeSettingsModal(
            "Create a task type",
            async (taskTypeSettings) => this.#settingService.addTaskTypeSettings(taskTypeSettings),
            new TaskTypeSettings()
        );
    }

    private openEditTaskTypeSettingsModal(taskTypeSettingsIndex: number, taskTypeSettings: TaskTypeSettings): void {
        return this.openTaskTypeSettingsModal(
            "Edit a task type",
            async (taskTypeSettings) => this.#settingService.updateTaskTypeSettings(taskTypeSettingsIndex, taskTypeSettings),
            taskTypeSettings
        );
    }

    private openTaskTypeSettingsModal(modalHeaderText: string, onSubmitCallback: ActionWithParameter<TaskTypeSettings>, taskTypeSettings: TaskTypeSettings): void {
        new TaskTypeSettingsModal(
            this.#plugin.app,
            modalHeaderText,
            onSubmitCallback,
            () => this.display(),
            taskTypeSettings
        ).open();
    }
}