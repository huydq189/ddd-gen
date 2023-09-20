import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../utils/create-folder-if-not-exists';

export function createDomainIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${lowerCaseAggregateName}/domain`;
    createFolderIfNotExists(aggregateFolder);
    const domainIndexFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(domainIndexFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        // export * from './aggregates';
        // export * from './builders';
        // export * from './dtos';
        // export * from './mappers';
        // export * from './repositories';
        writer.writeLine(`export * from './aggregates';`);
        writer.writeLine(`export * from './builders';`);
        writer.writeLine(`export * from './dtos';`);
        writer.writeLine(`export * from './mappers';`);
        writer.writeLine(`export * from './repositories';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${domainIndexFile}`, fileContent);
        return;
    }
}
