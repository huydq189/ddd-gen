import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../utils/create-folder-if-not-exists';

export function createAggregateUseCaseCommandIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/command`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateDTOFile = `${aggregateFolder}/index.ts`;

    if (!fs.existsSync(indexAggregateDTOFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './create-${lowerCaseAggregateName}.usecase.ts';`);
        writer.writeLine(`export * from './update-${lowerCaseAggregateName}.usecase.ts';`);
        writer.writeLine(`export * from './delete-${lowerCaseAggregateName}.usecase.ts';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateDTOFile}`, fileContent);
        return;
    }
    const fileContent = fs.readFileSync(indexAggregateDTOFile, 'utf8');
    if (!fileContent.includes(`export * from './create-${lowerCaseAggregateName}.usecase.ts';`)) {
        fs.appendFileSync(
            indexAggregateDTOFile,
            `export * from './create-${lowerCaseAggregateName}.usecase.ts';`,
        );
    }
    if (!fileContent.includes(`export * from './update-${lowerCaseAggregateName}.usecase.ts';`)) {
        fs.appendFileSync(
            indexAggregateDTOFile,
            `export * from './update-${lowerCaseAggregateName}.usecase.ts';`,
        );
    }
    if (!fileContent.includes(`export * from './delete-${lowerCaseAggregateName}.usecase.ts';`)) {
        fs.appendFileSync(
            indexAggregateDTOFile,
            `export * from './delete-${lowerCaseAggregateName}.usecase.ts';`,
        );
    }
}
