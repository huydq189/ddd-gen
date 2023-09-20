import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../../../utils/string';

// import { PaginationInput } from '@cbidigital/aqua';
// import { TimesheetDto } from '../../../../domain/dtos';

// export type CountListTimesheetUseCaseInput = PaginationInput<TimesheetDto>;
// export type CountListTimesheetUseCaseOutput = {
//     totalCount: number;
// };

export function createAggregateCountListUseCaseTypeFile(input: {
    aggregateName: string;
    domainName: string;
    properties: { key: string; value: string }[];
}) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/query/types`;
    createFolderIfNotExists(aggregateErrorFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { PaginationInput } from '@cbidigital/aqua';`)
        .writeLine(`import { ${aggregateClassName}Dto } from '../../../../domain';`)
        .writeLine(
            `export type CountList${aggregateClassName}UseCaseInput = PaginationInput<${aggregateClassName}Dto>;`,
        )
        .writeLine(`export type CountList${aggregateClassName}UseCaseOutput = {`)
        .writeLine(`${Space4x}totalCount: number;`)
        .writeLine(`};`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/count-list-${lowerCaseAggregateName}.types.ts`, fileContent);
}
