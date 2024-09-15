import { Vault } from "obsidian";
import IEventService from "./IEventService";
import FileChangedEvent from "./Models/FileChangedEvent";
import { EVENTS } from "src/Constants";

export default class EventService implements IEventService {
    #vault: Vault;

    public constructor(vault: Vault) {
        this.#vault = vault;
    }

    public triggerFileChangedEvent(event: FileChangedEvent): void {
        this.#vault.trigger(EVENTS.TASKS_TIME_TRACKER.FILE_CHANGED, event);
    }
}