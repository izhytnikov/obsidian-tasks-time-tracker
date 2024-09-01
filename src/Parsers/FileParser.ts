import Task from "./Task";
import { DataObject, getAPI } from "obsidian-dataview";
import Nullable from "src/Utils/Nullable";

export default class FileParser {
    public getTasksBySubpaths(path: string, subPaths: string[]): Task[] {
        const dataView = getAPI();
        const page = dataView.page(path);
        if (page == null) {
            return [];
        }

        const tasks = page.file.tasks.where((task: DataObject) => subPaths.includes(task.header.subpath));
        const result = tasks.values.map((task: DataObject) => new Task(task.status,
            new Nullable(task.scheduled?.toJSDate() ?? null)))

        return result;
    }
}