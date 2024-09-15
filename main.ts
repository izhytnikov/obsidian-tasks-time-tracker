import { Events, Plugin, TFile } from "obsidian";
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
import FileRepository from "src/Repositories/FileRepository";
import EventService from "src/Services/EventService";
import ISettingService from "src/Services/ISettingService";

export default class TasksTimeTrackerPlugin extends Plugin {
	#settingService: ISettingService;

	public async onload(): Promise<void> {
		const settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.#settingService = new SettingService(new SettingRepository(settings, this));

		this.#registerEvents();
		this.#registerMarkdownCodeBlockProcessors();
		this.#addSettingTabs();
	}

	#registerEvents(): void {
		const metadataChangedEventHandler = new DataviewMetadataChangedEventHandler(
			new TaskService(new TaskRepository()),
			new EventService(this.app.vault),
			this.#settingService
		);
		const fileChangedEventHandler = new FileChangedEventHandler(this.#settingService);

		this.registerEvent((this.app.metadataCache as Events)
			.on(EVENTS.DATAVIEW.METADATA_CHANGE, (eventName: string, file: TFile) => metadataChangedEventHandler.handle(eventName, file)));
		this.registerEvent((this.app.vault as Events)
			.on(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, (event: FileChangedEvent) => fileChangedEventHandler.handle(event)));
	}

	#registerMarkdownCodeBlockProcessors(): void {
		const tasksTimeTrackerCodeBlockProcessor = new TasksTimeTrackerCodeBlockProcessor(
			this.#settingService,
			new FileService(new FileRepository(this.app.vault))
		);

		this.registerMarkdownCodeBlockProcessor(TASKS_TIME_TRACKER_CODE_BLOCK_NAME,
			(_source, element, context) => tasksTimeTrackerCodeBlockProcessor.process(element, context));
	}

	#addSettingTabs(): void {
		this.addSettingTab(new TasksTimeTrackerPluginSettingTab(
			this.app,
			this,
			this.#settingService
		));
	}
}