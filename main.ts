import { Events, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, EVENTS, TASKS_TIME_TRACKER_CODE_BLOCK_NAME } from 'src/Constants';
import MetadataChangedEventHandler from 'src/EventHandler/MetadataChangedEventHandler';
import FileChangedEvent from 'src/Events/FileChangedEvent';
import TimeTrackerBlockRenderer from 'src/BlockRenderers/TimeTrackerBlockRenderer';
import PluginSettings from 'src/Settings/PluginSettings';
import Duration from 'src/Settings/Duration';
import TaskLog from 'src/Settings/TaskLog';

export default class MyPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		const metadataChangedEventHandler = new MetadataChangedEventHandler(this.app, this.settings);

		this.registerEvent((this.app.metadataCache as Events).on(EVENTS.DATAVIEW.METADATA_CHANGE, (eventName: string, file: TFile) =>
			metadataChangedEventHandler.handle(eventName, file)));

		this.registerEvent((this.app.vault as Events).on(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, async (event: FileChangedEvent) => {
			event.dateTaskLogs.forEach(log => {
				const nowDate = new Date(Date.now()).toISOString();
				const key = log.getDate().toDateString();

				const currentDateLog = this.settings.dateLogs[key];
				if (!currentDateLog) {
					if (log.getIsTaskInProgress()) {
						this.settings.dateLogs[key] = [new TaskLog(event.fileName, [new Duration(nowDate)])];
					}
				} else {
					const taskLog = currentDateLog.find(taskLog => taskLog.taskName === event.getFileName());
					if (taskLog) {
						if (log.getIsTaskInProgress()) {
							if (taskLog.durations.every(duration => duration.endDateString !== null)) {
								taskLog.durations.push(new Duration(nowDate));
							}
						} else {
							const inProgressTask = taskLog.durations.find(duration => duration.endDateString === null);
							if (inProgressTask) {
								inProgressTask.endDateString = nowDate;
							}
						}
					} else {
						if (log.getIsTaskInProgress()) {
							currentDateLog.push(new TaskLog(event.fileName, [new Duration(nowDate)]))
						}
					}
				}
			})

			await this.saveSettings();
		}));

		this.registerMarkdownCodeBlockProcessor(TASKS_TIME_TRACKER_CODE_BLOCK_NAME, (source, element, context) => {
			const child = new TimeTrackerBlockRenderer(element, this.app.vault, context.sourcePath);
			context.addChild(child);
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}