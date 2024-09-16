import type ISettingService from "src/Services/ISettingService";
import FileChangedEvent from "src/Services/Models/FileChangedEvent";
import { inject, injectable } from "tsyringe";

@injectable()
export default class FileChangedEventHandler {
    #settingService: ISettingService;

    public constructor(@inject("ISettingService") settingService: ISettingService) {
        this.#settingService = settingService;
    }

    public async handle(event: FileChangedEvent): Promise<void> {
        event.getDateTaskLogs().forEach(dateTaskLog =>
            this.#settingService.addOrUpdateDateLog(dateTaskLog.getDate(), event.getFileName(), dateTaskLog.isTaskInProgress()));
    }
}