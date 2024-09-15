import ISettingService from "src/Services/ISettingService";
import FileChangedEvent from "src/Services/Models/FileChangedEvent";

export default class FileChangedEventHandler {
    #settingService: ISettingService;

    public constructor(settingService: ISettingService) {
        this.#settingService = settingService;
    }

    public async handle(event: FileChangedEvent): Promise<void> {
        event.getDateTaskLogs().forEach(dateTaskLog =>
            this.#settingService.addOrUpdateDateLog(dateTaskLog.getDate(), event.getFileName(), dateTaskLog.isTaskInProgress()))
    }
}