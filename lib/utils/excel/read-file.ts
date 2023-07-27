import XLSX from 'xlsx';

/**
 * @description create a folder if provided path does not exists
 * @param path local to create the folder
 * @returns 0 if a new folder is created and 1 if not
 */
export const readExcelFile = (path: string) => {
    // Load the Excel file
    const workbook = XLSX.readFile(path);
    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];
    // Get the worksheet
    const worksheet = workbook.Sheets[sheetName];
    // Convert the worksheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return data as string[][];
};
