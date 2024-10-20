import Duration from "src/Services/Models/Duration";
import Interval from "src/Settings/Interval";

describe("constructor", () => {
    test("should set time properties", () => {
        // Arrange
        const hours = 1;
        const minutes = 2;
        const seconds = 3;

        // Act
        const duration = new Duration(hours, minutes, seconds);

        // Assert
        expect(duration.getHours()).toEqual(hours);
        expect(duration.getMinutes()).toEqual(minutes);
        expect(duration.getSeconds()).toEqual(seconds);
    });
});
describe("fromInterval", () => {
    test("should add an additional minute when the number of seconds exceeds 60", () => {
        // Arrange
        const interval = new Interval("2024-09-16T14:00:00.000Z");
        interval.endDateString = "2024-09-16T14:01:01.000Z";

        // Act
        const duration = Duration.fromInterval(interval);

        // Assert
        expect(duration.getHours()).toEqual(0);
        expect(duration.getMinutes()).toEqual(1);
        expect(duration.getSeconds()).toEqual(1);
    });
    test("should add an additional hour when the number of minutes exceeds 60", () => {
        // Arrange
        const interval = new Interval("2024-09-16T14:00:00.000Z");
        interval.endDateString = "2024-09-16T15:01:01.000Z";

        // Act
        const duration = Duration.fromInterval(interval);

        // Assert
        expect(duration.getHours()).toEqual(1);
        expect(duration.getMinutes()).toEqual(1);
        expect(duration.getSeconds()).toEqual(1);
    });
    test("should use the current date when the interval end date is null", () => {
        // Arrange
        Date.now = jest.fn(() => new Date("2024-09-16T15:01:01.000Z").valueOf());
        const interval = new Interval("2024-09-16T14:00:00.000Z");

        // Act
        const duration = Duration.fromInterval(interval);

        // Assert
        expect(duration.getHours()).toEqual(1);
        expect(duration.getMinutes()).toEqual(1);
        expect(duration.getSeconds()).toEqual(1);
    });
});
describe("getHours", () => {
    test("should return the number of hours", () => {
        // Arrange
        const hours = 1;
        const minutes = 2;
        const seconds = 3;

        // Act
        const duration = new Duration(hours, minutes, seconds);

        // Assert
        expect(duration.getHours()).toEqual(hours);
    });
});
describe("getMinutes", () => {
    test("should return the number of minutes", () => {
        // Arrange
        const hours = 1;
        const minutes = 2;
        const seconds = 3;

        // Act
        const duration = new Duration(hours, minutes, seconds);

        // Assert
        expect(duration.getMinutes()).toEqual(minutes);
    });
});
describe("getSeconds", () => {
    test("should return the number of seconds", () => {
        // Arrange
        const hours = 1;
        const minutes = 2;
        const seconds = 3;

        // Act
        const duration = new Duration(hours, minutes, seconds);

        // Assert
        expect(duration.getSeconds()).toEqual(seconds);
    });
});
describe("add", () => {
    test("should add an additional minute when the number of seconds exceeds 60", () => {
        // Arrange
        const firstDuration = new Duration(0, 0, 0);
        const secondDuration = new Duration(0, 0, 61);

        // Act
        firstDuration.add(secondDuration);

        // Assert
        expect(firstDuration.getHours()).toEqual(0);
        expect(firstDuration.getMinutes()).toEqual(1);
        expect(firstDuration.getSeconds()).toEqual(1);
    });
    test("should add an additional hour when the number of minutes exceeds 60", () => {
        // Arrange
        const firstDuration = new Duration(0, 0, 0);
        const secondDuration = new Duration(0, 61, 1);

        // Act
        firstDuration.add(secondDuration);

        // Assert
        expect(firstDuration.getHours()).toEqual(1);
        expect(firstDuration.getMinutes()).toEqual(1);
        expect(firstDuration.getSeconds()).toEqual(1);
    });
});
describe("toString", () => {
    test("should display two-digit hours, minutes, and seconds when they contain only single-digit numbers", () => {
        // Arrange
        const hours = 1;
        const minutes = 1;
        const seconds = 1;

        // Act
        const duration = new Duration(hours, minutes, seconds);

        // Assert
        expect(duration.toString()).toEqual("01:01:01");
    });
    test("should display two-digit hours, minutes, and seconds when they contain only two-digit numbers", () => {
        // Arrange
        const hours = 59;
        const minutes = 59;
        const seconds = 59;

        // Act
        const duration = new Duration(hours, minutes, seconds);

        // Assert
        expect(duration.toString()).toEqual("59:59:59");
    });
    test("should display three-digit hours, minutes, and seconds when they contain only three-digit numbers", () => {
        // Arrange
        const hours = 100;
        const minutes = 100;
        const seconds = 100;

        // Act
        const duration = new Duration(hours, minutes, seconds);

        // Assert
        expect(duration.toString()).toEqual("100:100:100");
    });
});