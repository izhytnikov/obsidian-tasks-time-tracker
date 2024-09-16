import { TFile, Vault } from "obsidian";
import { Nullable } from "src/Utils/Nullable";
import IFileRepository from "./IFileRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export default class FileRepository implements IFileRepository {
    #vault: Vault;

    public constructor(@inject(Vault) vault: Vault) {
        this.#vault = vault;
    }

    public getFileByPath(path: string): Nullable<TFile> {
        return this.#vault.getFileByPath(path);
    }
}