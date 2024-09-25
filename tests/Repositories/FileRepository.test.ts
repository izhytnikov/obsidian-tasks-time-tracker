import { Vault } from "obsidian";
import FileRepository from "src/Repositories/FileRepository";

describe("getFileByPath", () => {
    test("should return null if the file does not exist", () => {
        // Arrange
        const vault = new Vault();
        const fileRepository = new FileRepository(vault);
        const path = "Non-existing path";

        // Act
        const file = fileRepository.getFileByPath(path);

        // Assert
        expect(file).toBeNull();
        expect(vault.getFileByPath).toHaveBeenNthCalledWith(1, path);
    });
    test("should return the file if it exists", () => {
        // Arrange
        const vault = new Vault();
        const fileRepository = new FileRepository(vault);
        const path = "Existing path";

        // Act
        const file = fileRepository.getFileByPath(path);

        // Assert
        expect(file).not.toBeNull();
        expect(vault.getFileByPath).toHaveBeenNthCalledWith(1, path);
    });
});