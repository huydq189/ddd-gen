import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../utils/string';

// import { RuntimeError } from '@heronjs/common';
// import { SubjectErrorCodes } from '../consts';
// import { Subject } from '../subject';

// export class SubjectNotFoundError extends RuntimeError {
//     constructor(message?: string) {
//         super(Subject.AGGREGATE_NAME, SubjectErrorCodes.NOT_FOUND, message ?? 'Subject not found');
//     }
// }

export function createAggregateNotFoundErrorFile(input: any) {
    const { aggregateName, domainName } = input;

    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}/errors`;
    createFolderIfNotExists(aggregateErrorFolder);
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { RuntimeError } from '@heronjs/common';`)
        .writeLine(`import { ${aggregateClassName}ErrorCodes } from '../consts';`)
        .writeLine(`import ${aggregateClassName} from '../${lowerCaseAggregateName}';`)
        .write(`export class ${aggregateClassName}NotFoundError extends RuntimeError`)
        .block(() => {
            writer.write(`constructor(message?: string)`).block(() => {
                writer.writeLine(`super(`);
                writer.writeLine(`${aggregateClassName}.AGGREGATE_NAME,`);
                writer.writeLine(`${aggregateClassName}ErrorCodes.NOT_FOUND,`);
                writer.writeLine(`message ?? '${aggregateClassName} not found',`);
                writer.writeLine(`);`);
            });
        })
        .newLine();

    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/${lowerCaseAggregateName}-not-found.error.ts`, fileContent);
}
