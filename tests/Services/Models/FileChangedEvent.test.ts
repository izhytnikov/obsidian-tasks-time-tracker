import DateTaskLog from "src/Services/Models/DateTaskLog";
import FileChangedEvent from "src/Services/Models/FileChangedEvent";

describe("constructor", () => {
    test("should set properties", () => {
        // Arrange
        const fileName = "fileName";
        const filePath = "filePath";
        const dateTaskLogs = [new DateTaskLog(new Date(), false)];

        // Act
        const fileChangedEvent = new FileChangedEvent(fileName, filePath, dateTaskLogs);

        // Assert
        expect(fileChangedEvent.getFileName()).toEqual(fileName);
        expect(fileChangedEvent.getFilePath()).toEqual(filePath);
        expect(fileChangedEvent.getDateTaskLogs()).toEqual(dateTaskLogs);
    });
});
describe("getFileName", () => {
    test("should return the file name", () => {
        // Arrange
        const fileName = "fileName";
        const filePath = "filePath";
        const dateTaskLogs = [new DateTaskLog(new Date(), false)];

        // Act
        const fileChangedEvent = new FileChangedEvent(fileName, filePath, dateTaskLogs);

        // Assert
        expect(fileChangedEvent.getFileName()).toEqual(fileName);
    });
});
describe("getFilePath", () => {
    test("should return the file path", () => {
        // Arrange
        const fileName = "fileName";
        const filePath = "filePath";
        const dateTaskLogs = [new DateTaskLog(new Date(), false)];

        // Act
        const fileChangedEvent = new FileChangedEvent(fileName, filePath, dateTaskLogs);

        // Assert
        expect(fileChangedEvent.getFilePath()).toEqual(filePath);
    });
});
describe("getDateTaskLogs", () => {
    test("should return date task logs", () => {
        // Arrange
        const fileName = "fileName";
        const filePath = "filePath";
        const dateTaskLogs = [new DateTaskLog(new Date(), false)];

        // Act
        const fileChangedEvent = new FileChangedEvent(fileName, filePath, dateTaskLogs);

        // Assert
        expect(fileChangedEvent.getDateTaskLogs()).toEqual(dateTaskLogs);
    });
});