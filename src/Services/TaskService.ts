
import { inject, injectable } from "tsyringe";
import ITaskService from "./ITaskService";
import { Task } from "./Models/Task";
import type ITaskRepository from "src/Repositories/ITaskRepository";

@injectable()
export default class TaskService implements ITaskService {
    #taskRepository: ITaskRepository;

    public constructor(@inject("ITaskRepository") taskRepository: ITaskRepository) {
        this.#taskRepository = taskRepository;
    }

    public getScheduledTasksBySubpaths(path: string, subPaths: string[]): Task[] {
        const tasks = this.#taskRepository.getTasksByPath(path);

        return tasks.reduce((accumulator, task) => {
            if (task.scheduled && subPaths.includes(task.header.subpath)) {
                accumulator.push(new Task(task.status, task.scheduled.toJSDate()));
            }

            return accumulator;
        }, [] as Task[]);
    }
}