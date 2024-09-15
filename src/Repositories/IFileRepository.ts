import { TFile } from "obsidian";
import { Nullable } from "src/Utils/Nullable";

export default interface IFileRepository {
    getFileByPath(path: string): Nullable<TFile>;
}