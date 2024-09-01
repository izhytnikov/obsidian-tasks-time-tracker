
export default class Nullable<T> {
    #value: T | null;

    constructor(value: T | null = null) {
        this.#value = value;
    }

    public getValue(): T | null {
        return this.#value;
    }

    public setValue(value: T | null): void {
        this.#value = value;
    }

    public hasValue(): boolean {
        return this.#value !== null && this.#value !== undefined;
    }
}

export type Nullable2<T> = T | null;