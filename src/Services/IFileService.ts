import { TFile } from "obsidian";
import { Nullable } from "src/Utils/Nullable";

export default interface IFileService {
    getFileByPath(path: string): Nullable<TFile>;
}