export default class Duration {
    #hours: number;
    #minutes: number;
    #seconds: number;

    public constructor(hours: number, minutes: number, seconds: number) {
        this.#hours = hours;
        this.#minutes = minutes;
        this.#seconds = seconds;
    }

    public toString(): string {
        return `${this.#hours.toString().padStart(2, "0")}:${this.#minutes.toString().padStart(2, "0")}:${this.#seconds.toString().padStart(2, "0")}`;
    }
}