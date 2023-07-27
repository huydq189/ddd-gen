import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';

export function createAggregateMapperIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/mappers`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateMapperFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateMapperFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './${lowerCaseAggregateName}.mapper.ts';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateMapperFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateMapperFile, 'utf8');
    if (!fileContent.includes(`export * from './${lowerCaseAggregateName}.mapper.ts';`)) {
        fs.appendFileSync(indexAggregateMapperFile, `export * from './${lowerCaseAggregateName}.mapper.ts';`);
    }
}
