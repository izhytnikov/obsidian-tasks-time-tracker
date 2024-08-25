import { Events, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, EVENTS } from 'src/Constants';
import PluginSettings from 'src/Settings/PluginSettings';
import MetadataChangedEventHandler from 'src/EventHandler/MetadataChangedEventHandler';
import FileChangedEvent from 'src/Events/FileChangedEvent';

export default class MyPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		const metadataChangedEventHandler = new MetadataChangedEventHandler(this.app, this.settings);

		this.registerEvent((this.app.metadataCache as Events).on(EVENTS.DATAVIEW.METADATA_CHANGE, (eventName: string, file: TFile) =>
			metadataChangedEventHandler.handle(eventName, file)));
		this.registerEvent((this.app.vault as Events).on(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, (event: FileChangedEvent) =>
			console.log(event)));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}