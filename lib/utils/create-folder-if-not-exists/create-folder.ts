import { existsSync, mkdirSync } from 'node:fs';

/**
 * @description create a folder if provided path does not exists
 * @param path local to create the folder
 * @returns 0 if a new folder is created and 1 if not
 */
export const createFolderIfNotExists = (path: string): number => {
    const exists = existsSync(path);
    if (!exists) {
        mkdirSync(path, { recursive: true });
        return 0;
    }
    return 1;
};

export default createFolderIfNotExists;
