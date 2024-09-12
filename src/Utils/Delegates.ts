export type Action = () => void;
export type ActionWithParameter<T> = (parameter: T) => void;