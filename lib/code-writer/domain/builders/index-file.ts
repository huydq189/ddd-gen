import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';

// export * from './aggregate-create.types';
// export * from './aggregate-delete.types';
// export * from './aggregate-update.types';

export function createAggregateBuilderIndexFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/builders`;
    createFolderIfNotExists(aggregateFolder);
    const indexAggregateBuilderFile = `${aggregateFolder}/index.ts`;
    if (!fs.existsSync(indexAggregateBuilderFile)) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './${lowerCaseAggregateName}.builder';`);

        const fileContent = writer.toString();
        fs.writeFileSync(`${indexAggregateBuilderFile}`, fileContent);
        return;
    }

    const fileContent = fs.readFileSync(indexAggregateBuilderFile, 'utf8');
    if (!fileContent.includes(`export * from './${lowerCaseAggregateName}.builder';`)) {
        fs.appendFileSync(
            indexAggregateBuilderFile,
            `export * from './${lowerCaseAggregateName}.builder';\n`,
        );
    }
}
