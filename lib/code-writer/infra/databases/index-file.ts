import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';

export function createInfraIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${lowerCaseAggregateName}/infra`;
    createFolderIfNotExists(aggregateFolder);
    const infraDatabaseIndexFile = `${aggregateFolder}/databases/index.ts`;

    if (!fs.existsSync(infraDatabaseIndexFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './daos';`);
        writer.writeLine(`export * from './tables';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${infraDatabaseIndexFile}`, fileContent);
    }

    const infraIndexFile = `${aggregateFolder}/index.ts`;
    if (!fs.existsSync(infraIndexFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './databases';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${infraIndexFile}`, fileContent);
    }
}
