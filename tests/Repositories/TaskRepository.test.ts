import TaskRepository from "src/Repositories/TaskRepository";

describe("getTasksByPath", () => {
    test("should return an empty array if the page does not exist", () => {
        // Arrange
        const taskRepository = new TaskRepository();
        const path = "Non-existing path";

        // Act
        const tasks = taskRepository.getTasksByPath(path);

        // Assert
        expect(tasks).toHaveLength(0);
    });
    test("should return an empty array if the file does not exist", () => {
        // Arrange
        const taskRepository = new TaskRepository();
        const path = "Non-existing file";

        // Act
        const tasks = taskRepository.getTasksByPath(path);

        // Assert
        expect(tasks).toHaveLength(0);
    });
    test("should return an empty array if the values do not exist", () => {
        // Arrange
        const taskRepository = new TaskRepository();
        const path = "Non-existing values";

        // Act
        const tasks = taskRepository.getTasksByPath(path);

        // Assert
        expect(tasks).toHaveLength(0);
    });
    test("should return an empty array if the values are empty", () => {
        // Arrange
        const taskRepository = new TaskRepository();
        const path = "Empty values";

        // Act
        const tasks = taskRepository.getTasksByPath(path);

        // Assert
        expect(tasks).toHaveLength(0);
    });
    test("should return array if the values exist", () => {
        // Arrange
        const taskRepository = new TaskRepository();
        const path = "Non-empty values";

        // Act
        const tasks = taskRepository.getTasksByPath(path);

        // Assert
        expect(tasks).toHaveLength(3);
    });
});