import { TFile, Vault } from "obsidian";
import { Nullable } from "src/Utils/Nullable";
import IFileRepository from "./IFileRepository";

export default class FileRepository implements IFileRepository {
    #vault: Vault;

    public constructor(vault: Vault) {
        this.#vault = vault;
    }

    public getFileByPath(path: string): Nullable<TFile> {
        return this.#vault.getFileByPath(path);
    }
}