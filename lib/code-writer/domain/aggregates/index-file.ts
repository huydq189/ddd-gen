import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';

export function createDomainAggregateIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates`;
    createFolderIfNotExists(aggregateFolder);
    const domainIndexFile = `${aggregateFolder}/index.ts`;
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });
    if (!fs.existsSync(domainIndexFile)) {
        // export * from './aggregates';
        // export * from './builders';
        // export * from './dtos';
        // export * from './mappers';
        // export * from './repositories';
        writer.writeLine(`export * from './${aggregateName.toLowerCase()}';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${domainIndexFile}`, fileContent);
    }

    if (!fs.existsSync(`${aggregateFolder}/${aggregateName.toLowerCase()}/index.ts`)) {
        writer
            .writeLine(`export * from './consts';`)
            .writeLine(`export * from './types';`)
            .writeLine(`export * from './errors';`)
            .writeLine(`export * from './${aggregateName.toLowerCase()}';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${aggregateFolder}/${aggregateName.toLowerCase()}/index.ts`, fileContent);
        return;
    }
}
