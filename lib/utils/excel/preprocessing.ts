/**
 * @description create a folder if provided path does not exists
 * @param path local to create the folder
 * @returns 0 if a new folder is created and 1 if not
 */
export const preprocessing = (data: string[][]) => {
    const aggregateName = data[0][0];
    const properties = data.slice(1).map((currElement) => {
        return {
            key: currElement[0],
            value: currElement[1],
        };
    });
    return { aggregateName, properties };
};
