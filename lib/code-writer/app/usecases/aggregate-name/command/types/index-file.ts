import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';

export function createAggregateUseCaseCommandTypeIndexFile(input: {
    aggregateName: string;
    domainName: string;
}) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/command/types`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateDtoFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateDtoFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './create-${lowerCaseAggregateName}.types';`);
        writer.writeLine(`export * from './update-${lowerCaseAggregateName}.types.ts';`);
        writer.writeLine(`export * from './delete-${lowerCaseAggregateName}.types.ts';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateDtoFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateDtoFile, 'utf8');
    if (!fileContent.includes(`export * from './create-${lowerCaseAggregateName}.types';`)) {
        fs.appendFileSync(
            indexAggregateDtoFile,
            `export * from './create-${lowerCaseAggregateName}.types';\n`,
        );
    }
    if (!fileContent.includes(`export * from './update-${lowerCaseAggregateName}.types';`)) {
        fs.appendFileSync(
            indexAggregateDtoFile,
            `export * from './update-${lowerCaseAggregateName}.types';\n`,
        );
    }
    if (!fileContent.includes(`export * from './delete-${lowerCaseAggregateName}.types';`)) {
        fs.appendFileSync(
            indexAggregateDtoFile,
            `export * from './delete-${lowerCaseAggregateName}.types';\n`,
        );
    }
}
