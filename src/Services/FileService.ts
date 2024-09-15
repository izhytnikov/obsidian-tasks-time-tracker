import IFileRepository from "src/Repositories/IFileRepository";
import IFileService from "./IFileService";
import { TFile } from "obsidian";
import { Nullable } from "src/Utils/Nullable";

export default class FileService implements IFileService {
    #fileRepository: IFileRepository;

    public constructor(fileRepository: IFileRepository) {
        this.#fileRepository = fileRepository;
    }

    public getFileByPath(path: string): Nullable<TFile> {
        return this.#fileRepository.getFileByPath(path);
    }
}