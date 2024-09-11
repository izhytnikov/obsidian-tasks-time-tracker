import { Nullable } from "src/Utils/Nullable";
import { DataObject, getAPI } from "obsidian-dataview";

export class Task {
    #statusSymbol: string;
    #scheduledDate: Nullable<Date>;

    public constructor(statusSymbol: string, scheduledDate: Nullable<Date>) {
        this.#statusSymbol = statusSymbol;
        this.#scheduledDate = scheduledDate;
    }

    public getStatusSymbol(): string {
        return this.#statusSymbol;
    }

    public getScheduledDate(): Nullable<Date> {
        return this.#scheduledDate;
    }
}

export default class TaskRetrieverService {
    public getTasksBySubpaths(path: string, subPaths: string[]): Task[] {
        const dataView = getAPI();
        const page = dataView.page(path);
        if (page == null) {
            return [];
        }

        const tasks = page.file.tasks.where((task: DataObject) => subPaths.includes(task.header.subpath));
        const result = tasks.values.map((task: DataObject) => new Task(task.status, task.scheduled?.toJSDate() ?? null))

        return result;
    }
}