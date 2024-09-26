export class DataviewApi {
    public page(path: string): object | null {
        switch (path) {
            case "Non-existing file":
                return { file: null };
            case "Non-existing tasks":
                return { file: { tasks: null } };
            case "Non-existing values":
                return { file: { tasks: { values: null } } };
            case "Empty values":
                return { file: { tasks: { values: [] } } };
            case "Non-empty values":
                return { file: { tasks: { values: [1, 2, 3] } } };
            default:
                return null;
        }
    }
}

export const getAPI = jest.fn().mockImplementation(() => new DataviewApi());