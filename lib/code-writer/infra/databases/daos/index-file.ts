import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';

export function createAggregateDAOIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/infra/databases/daos`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateDAOFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateDAOFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './${lowerCaseAggregateName}.dao.ts';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateDAOFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateDAOFile, 'utf8');
    if (!fileContent.includes(`export * from './${lowerCaseAggregateName}.dao.ts';`)) {
        fs.appendFileSync(indexAggregateDAOFile, `export * from './${lowerCaseAggregateName}.dao.ts';`);
    }
}
