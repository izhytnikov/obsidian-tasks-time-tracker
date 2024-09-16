import "reflect-metadata";
import { App, Events, Plugin, TFile, Vault } from "obsidian";
import { DEFAULT_SETTINGS, EVENTS, TASKS_TIME_TRACKER_CODE_BLOCK_NAME } from "src/Constants";
import DataviewMetadataChangedEventHandler from "src/EventHandlers/DataviewMetadataChangedEventHandler";
import FileChangedEvent from "src/Services/Models/FileChangedEvent";
import FileChangedEventHandler from "src/EventHandlers/FileChangedEventHandler";
import TasksTimeTrackerCodeBlockProcessor from "src/CodeBlockProcessors/TasksTimeTrackerCodeBlockProcessor";
import TasksTimeTrackerPluginSettingTab from "src/PluginSettingTabs/TasksTimeTrackerPluginSettingTab";
import TaskService from "src/Services/TaskService";
import TaskRepository from "src/Repositories/TaskRepository";
import SettingService from "src/Services/SettingService";
import SettingRepository from "src/Repositories/SettingRepository";
import FileService from "src/Services/FileService";
import EventService from "src/Services/EventService";
import { container } from "tsyringe";
import IPluginSettings from "src/Settings/IPluginSettings";
import FileRepository from "src/Repositories/FileRepository";

export default class TasksTimeTrackerPlugin extends Plugin {
	#settings: IPluginSettings;

	public async onload(): Promise<void> {
		await this.#loadSettings();
		this.#registerDependencies();
		this.#registerEvents();
		this.#registerMarkdownCodeBlockProcessors();
		this.#addSettingTabs();
	}

	async #loadSettings(): Promise<void> {
		this.#settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async #registerDependencies(): Promise<void> {
		// Register Obsidian classes
		container.register(App, { useValue: this.app });
		container.register(Vault, { useValue: this.app.vault });
		container.register("Plugin", { useValue: this });

		// Register settings
		container.register("IPluginSettings", { useValue: this.#settings });

		// Register repositories
		container.register("ITaskRepository", { useClass: TaskRepository });
		container.register("ISettingRepository", { useClass: SettingRepository });
		container.register("IFileRepository", { useClass: FileRepository });

		// Register services
		container.register("ITaskService", { useClass: TaskService });
		container.register("ISettingService", { useClass: SettingService });
		container.register("IEventService", { useClass: EventService });
		container.register("IFileService", { useClass: FileService });

		// Register event handlers
		container.register(DataviewMetadataChangedEventHandler, { useClass: DataviewMetadataChangedEventHandler });
		container.register(FileChangedEventHandler, { useClass: FileChangedEventHandler });

		// Register code block processors
		container.register(TasksTimeTrackerCodeBlockProcessor, { useClass: TasksTimeTrackerCodeBlockProcessor });

		// Register setting tabs
		container.register(TasksTimeTrackerPluginSettingTab, { useClass: TasksTimeTrackerPluginSettingTab });
	}

	#registerEvents(): void {
		const metadataChangedEventHandler = container.resolve(DataviewMetadataChangedEventHandler);
		const fileChangedEventHandler = container.resolve(FileChangedEventHandler);

		this.registerEvent((this.app.metadataCache as Events)
			.on(EVENTS.DATAVIEW.METADATA_CHANGE, (eventName: string, file: TFile) => metadataChangedEventHandler.handle(eventName, file)));
		this.registerEvent((this.app.vault as Events)
			.on(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, (event: FileChangedEvent) => fileChangedEventHandler.handle(event)));
	}

	#registerMarkdownCodeBlockProcessors(): void {
		const tasksTimeTrackerCodeBlockProcessor = container.resolve(TasksTimeTrackerCodeBlockProcessor);

		this.registerMarkdownCodeBlockProcessor(TASKS_TIME_TRACKER_CODE_BLOCK_NAME,
			(_source, element, context) => tasksTimeTrackerCodeBlockProcessor.process(element, context));
	}

	#addSettingTabs(): void {
		const tasksTimeTrackerPluginSettingTab = container.resolve(TasksTimeTrackerPluginSettingTab);
		this.addSettingTab(tasksTimeTrackerPluginSettingTab);
	}
}