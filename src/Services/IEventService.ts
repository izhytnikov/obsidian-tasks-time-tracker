import FileChangedEvent from "./Models/FileChangedEvent";

export default interface IEventService {
    triggerFileChangedEvent(event: FileChangedEvent): void;
}