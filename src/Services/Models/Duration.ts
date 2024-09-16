import Interval from "src/Settings/Interval";

export default class Duration {
    #hours: number;
    #minutes: number;
    #seconds: number;

    public constructor(hours: number, minutes: number, seconds: number) {
        this.#hours = hours;
        this.#minutes = minutes;
        this.#seconds = seconds;
    }

    public static fromInterval(interval: Interval): Duration {
        const startDate = new Date(interval.startDateString);
        const endDate = interval.endDateString !== null
            ? new Date(interval.endDateString)
            : new Date(Date.now());

        const durationMilliseconds = endDate.getTime() - startDate.getTime();
        let durationSeconds = durationMilliseconds / 1000;

        const durationHours = Math.floor(durationSeconds / 3600);
        durationSeconds -= durationHours * 3600;

        const durationMinutes = Math.floor(durationSeconds / 60) % 60;
        durationSeconds -= durationMinutes * 60;

        durationSeconds = Math.ceil(durationSeconds % 60);

        return new Duration(durationHours, durationMinutes, durationSeconds);
    }

    public getHours(): number {
        return this.#hours;
    }

    public getMinutes(): number {
        return this.#minutes;
    }

    public getSeconds(): number {
        return this.#seconds;
    }

    public add(duration: Duration): void {
        const totalSeconds = this.#seconds + duration.getSeconds();
        const totalMinutes = this.#minutes + duration.getMinutes() + Math.floor(totalSeconds / 60);
        const totalHours = this.#hours + duration.getHours() + Math.floor(totalMinutes / 60);

        this.#seconds = totalSeconds % 60;
        this.#minutes = totalMinutes % 60;
        this.#hours = totalHours;
    }

    public toString(): string {
        return `${this.#hours.toString().padStart(2, "0")}:${this.#minutes.toString().padStart(2, "0")}:${this.#seconds.toString().padStart(2, "0")}`;
    }
}