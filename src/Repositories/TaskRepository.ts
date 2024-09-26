import { DataObject, DataviewApi, getAPI } from "obsidian-dataview";
import ITaskRepository from "./ITaskRepository";
import { injectable } from "tsyringe";

@injectable()
export default class TaskRepository implements ITaskRepository {
    #dataviewApi: DataviewApi;

    public constructor() {
        this.#dataviewApi = getAPI();
    }

    public getTasksByPath(path: string): DataObject[] {
        const page = this.#dataviewApi.page(path);
        return page?.file?.tasks?.values ?? [];
    }
}