import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../utils/string';

// export enum UnitEventNames {
//   CREATE = 'unit_created',
//   UPDATE = 'unit_updated',
//   DELETED = 'unit_deleted',
// }

export function createAggregateEventNamesConstFile(input: any) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);
    const aggregateConstFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}/consts`;
    createFolderIfNotExists(aggregateConstFolder);
    const writer = new mod.default({
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .write(`export enum ${aggregateClassName}EventNames`)
        .block(() => {
            writer.writeLine(`CREATE = '${lowerCaseAggregateName}_created',`);
            writer.writeLine(`UPDATE = '${lowerCaseAggregateName}_updated',`);
            writer.writeLine(`DELETED = '${lowerCaseAggregateName}_deleted',`);
        })
        .newLine();

    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateConstFolder}/${lowerCaseAggregateName}-event-names.const.ts`, fileContent);
}
