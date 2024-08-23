import Task from "./Task";

export default interface IFileParser {
    getTasksBySubpaths(path: string, subPaths: string[]): Task[];
}