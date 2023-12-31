import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../utils/create-folder-if-not-exists';

export function createAggregateUseCaseQueryIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/query`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateDtoFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateDtoFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './get-list-${lowerCaseAggregateName}.usecase';`);
        writer.writeLine(`export * from './get-${lowerCaseAggregateName}-by-id.usecase';`);
        writer.writeLine(`export * from './count-list-${lowerCaseAggregateName}.usecase';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateDtoFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateDtoFile, 'utf8');
    if (!fileContent.includes(`export * from './get-list-${lowerCaseAggregateName}.usecase';`)) {
        fs.appendFileSync(
            indexAggregateDtoFile,
            `export * from './get-list-${lowerCaseAggregateName}.usecase';\n`,
        );
    }
    if (!fileContent.includes(`export * from './get-${lowerCaseAggregateName}-by-id.usecase';`)) {
        fs.appendFileSync(
            indexAggregateDtoFile,
            `export * from './get-${lowerCaseAggregateName}-by-id.usecase';\n`,
        );
    }
    if (!fileContent.includes(`export * from './count-list-${lowerCaseAggregateName}.usecase';`)) {
        fs.appendFileSync(
            indexAggregateDtoFile,
            `export * from './count-list-${lowerCaseAggregateName}.usecase';\n`,
        );
    }
}
