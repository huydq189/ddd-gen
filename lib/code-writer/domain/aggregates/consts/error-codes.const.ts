import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../utils/string';

// export enum UnitErrorCodes {
//   NOT_FOUND = 10000,
//   CODE_ALREADY_EXIST = 10001,
// }

export function createAggregateErrorCodesConstFile(input: any) {
    const { aggregateName, domainName } = input;

    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const classNameAggregateName = createClassName(aggregateName);
    const aggregateConstFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}/consts`;
    createFolderIfNotExists(aggregateConstFolder);
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .write(`export enum ${classNameAggregateName}ErrorCodes`)
        .block(() => {
            writer.writeLine(`NOT_FOUND = 10000,`);
            writer.writeLine(`CODE_ALREADY_EXIST = 10001,`);
        })
        .newLine();

    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateConstFolder}/${lowerCaseAggregateName}-error-codes.const.ts`, fileContent);
}
