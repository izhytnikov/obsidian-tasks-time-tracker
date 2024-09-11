import { Events, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, EVENTS, TASKS_TIME_TRACKER_CODE_BLOCK_NAME } from 'src/Constants';
import DataviewMetadataChangedEventHandler from 'src/EventHandlers/DataviewMetadataChangedEventHandler';
import FileChangedEvent from 'src/Events/FileChangedEvent';
import IPluginSettings from 'src/Settings/IPluginSettings';
import FileChangedEventHandler from 'src/EventHandlers/FileChangedEventHandler';
import TasksTimeTrackerCodeBlockProcessor from 'src/CodeBlockProcessors/TasksTimeTrackerCodeBlockProcessor';

export default class TasksTimeTrackerPlugin extends Plugin {
	#settings: IPluginSettings;

	public async onload(): Promise<void> {
		await this.loadSettings();

		this.#registerEvents();
		this.#registerMarkdownCodeBlockProcessors();
	}

	public async loadSettings(): Promise<void> {
		this.#settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	public async saveSettings(): Promise<void> {
		await this.saveData(this.#settings);
	}

	#registerEvents(): void {
		const metadataChangedEventHandler = new DataviewMetadataChangedEventHandler(this.app, this.#settings);
		const fileChangedEventHandler = new FileChangedEventHandler(this.#settings, this);

		this.registerEvent((this.app.metadataCache as Events)
			.on(EVENTS.DATAVIEW.METADATA_CHANGE, (eventName: string, file: TFile) => metadataChangedEventHandler.handle(eventName, file)));
		this.registerEvent((this.app.vault as Events)
			.on(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, (event: FileChangedEvent) => fileChangedEventHandler.handle(event)));
	}

	#registerMarkdownCodeBlockProcessors(): void {
		const tasksTimeTrackerCodeBlockProcessor = new TasksTimeTrackerCodeBlockProcessor(this.#settings, this.app.vault);

		this.registerMarkdownCodeBlockProcessor(TASKS_TIME_TRACKER_CODE_BLOCK_NAME,
			(_source, element, context) => tasksTimeTrackerCodeBlockProcessor.process(element, context));
	}
}