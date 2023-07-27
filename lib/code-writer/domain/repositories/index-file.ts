import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';

export function createAggregateRepositoryIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/repositories`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateRepositoryFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateRepositoryFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './${lowerCaseAggregateName}.repository.ts';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateRepositoryFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateRepositoryFile, 'utf8');
    if (!fileContent.includes(`export * from './${lowerCaseAggregateName}.repository.ts';`)) {
        fs.appendFileSync(
            indexAggregateRepositoryFile,
            `export * from './${lowerCaseAggregateName}.repository.ts';`,
        );
    }
}
