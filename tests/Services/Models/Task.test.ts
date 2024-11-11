import { Task } from "src/Services/Models/Task";

describe("constructor", () => {
    test("should set properties", () => {
        // Arrange
        const statusSymbol = "/";
        const scheduledDate = new Date();

        // Act
        const task = new Task(statusSymbol, scheduledDate);

        // Assert
        expect(task.hasStatusSymbol(statusSymbol)).toBeTruthy();
        expect(task.getScheduledDate()).toEqual(scheduledDate);
    });
});
describe("hasStatusSymbol", () => {
    test("should return true when the passed symbol equals the preset symbol", () => {
        // Arrange
        const statusSymbol = "/";
        const scheduledDate = new Date();

        // Act
        const task = new Task(statusSymbol, scheduledDate);

        // Assert
        expect(task.hasStatusSymbol(statusSymbol)).toBeTruthy();
    });
    test("should return false when the passed symbol does not equal the preset symbol", () => {
        // Arrange
        const statusSymbol = "/";
        const scheduledDate = new Date();

        // Act
        const task = new Task(statusSymbol, scheduledDate);

        // Assert
        expect(task.hasStatusSymbol("x")).toBeFalsy();
    });
});
describe("getScheduledDate", () => {
    test("should return the scheduled date", () => {
        // Arrange
        const statusSymbol = "/";
        const scheduledDate = new Date();

        // Act
        const task = new Task(statusSymbol, scheduledDate);

        // Assert
        expect(task.getScheduledDate()).toEqual(scheduledDate);
    });
});