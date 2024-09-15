import { Task } from "./Models/Task";

export default interface ITaskService {
    getScheduledTasksBySubpaths(path: string, subPaths: string[]): Task[]
}