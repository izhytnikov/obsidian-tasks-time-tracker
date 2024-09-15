import { App, Modal, Setting } from "obsidian";
import { EMPTY_STRING, SUBPATHS_SEPARATOR_SYMBOL } from "src/Constants";
import TaskTypeSettings from "src/Settings/TaskTypeSettings";
import { Action, ActionWithParameter } from "src/Utils/Delegates";

export default class TaskTypeSettingsModal extends Modal {
    #modalHeaderText: string;
    #onSubmitCallback: ActionWithParameter<TaskTypeSettings>;
    #onCloseCallback: Action;
    #taskTypeSettings: TaskTypeSettings;
    #submitButton: Setting;

    public constructor(app: App, modalHeaderText: string, onSubmitCallback: ActionWithParameter<TaskTypeSettings>, onCloseCallback: Action, taskTypeSettings: TaskTypeSettings) {
        super(app);
        this.#modalHeaderText = modalHeaderText;
        this.#onSubmitCallback = onSubmitCallback;
        this.#onCloseCallback = onCloseCallback;
        this.#taskTypeSettings = taskTypeSettings;
    }

    public onOpen(): void {
        const { contentEl } = this;

        contentEl.createEl("h1", { text: this.#modalHeaderText });

        new Setting(contentEl)
            .setName("Path")
            .setDesc("The file path where tasks are stored.")
            .addText((text) =>
                text.setPlaceholder("Tasks/Specific")
                    .setValue(this.#taskTypeSettings.path ?? EMPTY_STRING)
                    .onChange((value) => {
                        this.#taskTypeSettings.path = value;
                        this.#setSubmitButtonDisabled();
                    })
            );

        new Setting(contentEl)
            .setName("Subpaths")
            .setDesc(`A symbol-separated (${SUBPATHS_SEPARATOR_SYMBOL}) list of file headers under which tasks are organized.`)
            .addText((text) =>
                text.setPlaceholder("General, Task-specific")
                    .setValue(this.#taskTypeSettings.subpaths.join(SUBPATHS_SEPARATOR_SYMBOL))
                    .onChange((value) => {
                        this.#taskTypeSettings.subpaths = value.split(SUBPATHS_SEPARATOR_SYMBOL)
                            .map(subpath => subpath.trim())
                            .filter(subpath => subpath !== EMPTY_STRING);
                        this.#setSubmitButtonDisabled();
                    })
            );

        this.#submitButton = new Setting(contentEl)
            .addButton((button) =>
                button.setButtonText("Submit")
                    .onClick(() => {
                        this.#onSubmitCallback(this.#taskTypeSettings);
                        this.close();
                    }));

        this.#setSubmitButtonDisabled();
    }

    public onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
        this.#onCloseCallback();
    }

    #setSubmitButtonDisabled(): void {
        const isTaskTypeSettingsValid = this.#taskTypeSettings.path !== null
            && this.#taskTypeSettings.path !== EMPTY_STRING
            && this.#taskTypeSettings.subpaths.length !== 0;

        this.#submitButton.setDisabled(!isTaskTypeSettingsValid);
    }
}