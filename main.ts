import { Events, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, EVENTS, TASKS_TIME_TRACKER_CODE_BLOCK_NAME } from 'src/Constants';
import MetadataChangedEventHandler from 'src/EventHandler/MetadataChangedEventHandler';
import FileChangedEvent from 'src/Events/FileChangedEvent';
import TimeTrackerBlockRenderer from 'src/BlockRenderers/TimeTrackerBlockRenderer';
import PluginSettings from 'src/Settings/PluginSettings';
import { Duration } from 'src/Settings/Duration';
import TaskLog from 'src/Settings/TaskLog';

export default class MyPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		const metadataChangedEventHandler = new MetadataChangedEventHandler(this.app, this.settings);

		this.registerEvent((this.app.metadataCache as Events).on(EVENTS.DATAVIEW.METADATA_CHANGE, (eventName: string, file: TFile) =>
			metadataChangedEventHandler.handle(eventName, file)));

		this.registerEvent((this.app.vault as Events).on(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, async (event: FileChangedEvent) => {
			console.log(event);

			event.dateTaskLogs.forEach(log => {
				const nowDate = new Date(Date.now());
				const key = log.getDate().toDateString();

				const currentDateLog = this.settings.dateLogs[key];
				if (!currentDateLog) {
					if (log.getIsTaskInProgress()) {
						this.settings.dateLogs[key] = [new TaskLog(event.fileName, [new Duration(nowDate)])];
					}
				} else {
					const relatedTaskLog = currentDateLog.find(taskLog => taskLog.taskName === event.getFileName());
					if (relatedTaskLog) {
						if (log.getIsTaskInProgress()) {
							if (relatedTaskLog.durations.every((duration: Duration) => !duration.isInProgress2())) {
								relatedTaskLog.durations.push(new Duration(nowDate));
							}
						} else {
							const inProgressTask = relatedTaskLog.durations.find((duration: Duration) => {
								console.log(duration);
								return duration.isInProgress2();
							});
							if (inProgressTask) {
								inProgressTask.setEndDate(nowDate);
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