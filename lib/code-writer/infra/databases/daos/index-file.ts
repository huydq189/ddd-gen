import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';

export function createAggregateDaoIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/infra/databases/daos`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateDaoFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateDaoFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './${lowerCaseAggregateName}.dao';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateDaoFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateDaoFile, 'utf8');
    if (!fileContent.includes(`export * from './${lowerCaseAggregateName}.dao';`)) {
        fs.appendFileSync(indexAggregateDaoFile, `export * from './${lowerCaseAggregateName}.dao';\n`);
    }
}
