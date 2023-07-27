import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';

export function createAggregateTableIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/infra/databases/tables`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateTableFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateTableFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './${lowerCaseAggregateName}.table.ts';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateTableFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateTableFile, 'utf8');
    if (!fileContent.includes(`export * from './${lowerCaseAggregateName}.table.ts';`)) {
        fs.appendFileSync(indexAggregateTableFile, `export * from './${lowerCaseAggregateName}.table.ts';`);
    }
}
