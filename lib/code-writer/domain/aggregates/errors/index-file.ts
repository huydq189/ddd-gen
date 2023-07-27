import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';

// export * from './not-found.error';
// export * from './code-already-exist.error';

export function createAggregateIndexErrorFile(input: any) {
    const { aggregateName, domainName } = input;

    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}/errors`;
    createFolderIfNotExists(aggregateErrorFolder);
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer.writeLine(`export * from './${lowerCaseAggregateName}-code-already-exist.error';`);
    writer.writeLine(`export * from './${lowerCaseAggregateName}-not-found.error';`);

    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/index.ts`, fileContent);
}
