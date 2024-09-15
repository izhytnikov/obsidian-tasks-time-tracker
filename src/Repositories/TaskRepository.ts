import { DataObject, DataviewApi, getAPI } from "obsidian-dataview";
import ITaskRepository from "./ITaskRepository";

export default class TaskRepository implements ITaskRepository {
    #dataviewApi: DataviewApi;

    public constructor() {
        this.#dataviewApi = getAPI();
    }

    public getTasksByPath(path: string): DataObject[] {
        const page = this.#dataviewApi.page(path);
        if (page == null) {
            return [];
        }

        return page.file.tasks.values;
    }
}