import DateTaskLog from "src/Services/Models/DateTaskLog";

describe("constructor", () => {
    test("should set date and task in-progress properties", () => {
        // Arrange
        const date = new Date("December 17, 1995 03:24:00");
        const isTaskInProgress = true;

        // Act
        const dateTaskLog = new DateTaskLog(date, isTaskInProgress);

        // Assert
        expect(dateTaskLog.getDate()).toEqual(date);
        expect(dateTaskLog.isTaskInProgress()).toEqual(isTaskInProgress);
    });
});
describe("getDate", () => {
    test("should return the date property", () => {
        // Arrange
        const date = new Date("December 17, 1995 03:24:00");
        const isTaskInProgress = true;

        // Act
        const dateTaskLog = new DateTaskLog(date, isTaskInProgress);

        // Assert
        expect(dateTaskLog.getDate()).toEqual(date);
    });
});
describe("isTaskInProgress", () => {
    test("should return the task in-progress property", () => {
        // Arrange
        const date = new Date("December 17, 1995 03:24:00");
        const isTaskInProgress = true;

        // Act
        const dateTaskLog = new DateTaskLog(date, isTaskInProgress);

        // Assert
        expect(dateTaskLog.isTaskInProgress()).toEqual(isTaskInProgress);
    });
});
describe("setTaskInProgress", () => {
    test("should set the task in-progress property.", () => {
        // Arrange
        const date = new Date("December 17, 1995 03:24:00");
        const isTaskInProgress = false;
        const newIsTaskInProgress = true;

        // Act
        const dateTaskLog = new DateTaskLog(date, isTaskInProgress);
        dateTaskLog.setTaskInProgress(newIsTaskInProgress);

        // Assert
        expect(dateTaskLog.isTaskInProgress()).toEqual(newIsTaskInProgress);
    });
});