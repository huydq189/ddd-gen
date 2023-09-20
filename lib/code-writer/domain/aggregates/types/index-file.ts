import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';

// export * from './aggregate-create.types';
// export * from './aggregate-delete.types';
// export * from './aggregate-update.types';

export function createAggregateIndexTypeFile(input: { aggregateName: string; domainName: string }) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}/types`;
    createFolderIfNotExists(aggregateErrorFolder);
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });
    // writer.writeLine(`export * from './${lowerCaseAggregateName}-create.types';`);
    // writer.writeLine(`export * from './${lowerCaseAggregateName}-update.types';`);
    // writer.writeLine(`export * from './${lowerCaseAggregateName}-delete.types';`);

    writer.writeLine(`export * from './${lowerCaseAggregateName}.types';`);
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/index.ts`, fileContent);
}
