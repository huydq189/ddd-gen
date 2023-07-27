import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';

// export * from './unit-error-codes.consts';
// export * from './unit-event-names.consts';

export function createAggregateIndexConstFile(input: any) {
    const { aggregateName, domainName } = input;

    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateConstFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}/consts`;
    createFolderIfNotExists(aggregateConstFolder);
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer.writeLine(`export * from './${lowerCaseAggregateName}-error-codes.const';`);
    writer.writeLine(`export * from './${lowerCaseAggregateName}-event-names.const';`);

    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateConstFolder}/index.ts`, fileContent);
}
