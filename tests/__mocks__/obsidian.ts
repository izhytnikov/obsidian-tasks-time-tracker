export class TFile {
    public basename: string;
    public extension: string;
}

export const Vault = jest.fn().mockImplementation(() => {
    return {
        getFileByPath: jest.fn(path => path === "Existing path" ? new TFile : null)
    };
});

export const Plugin = jest.fn().mockImplementation(() => {
    return {
        saveData: jest.fn()
    };
});