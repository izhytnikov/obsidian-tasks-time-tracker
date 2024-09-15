import { DataObject } from "obsidian-dataview";

export default interface ITaskRepository {
    getTasksByPath(path: string): DataObject[];
}