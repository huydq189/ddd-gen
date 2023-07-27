import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../../../utils/string';

// import { PaginationInput } from '@cbidigital/aqua';
// import { TimesheetDto } from '../../../../../domain';
// import { GetTimesheetUseCaseOutput } from './get-timesheet-by-id.types';

// export type GetListTimesheetUseCaseInput = PaginationInput<TimesheetDto>;
// export type GetListTimesheetUseCaseOutput = GetTimesheetUseCaseOutput[];

export function createAggregateGetListUseCaseTypeFile(input: {
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
        .writeLine(`import { ${aggregateClassName}DTO } from '../../../../../domain';`)
        .writeLine(
            `import { Get${aggregateClassName}UseCaseOutput } from './get-${lowerCaseAggregateName}-by-id.usecase.types';`,
        )
        .writeLine(
            `export type GetList${aggregateClassName}UseCaseInput = PaginationInput<${aggregateClassName}DTO>;`,
        )
        .writeLine(
            `export type GetList${aggregateClassName}UseCaseOutput = Get${aggregateClassName}UseCaseOutput[];`,
        );

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(
        `${aggregateErrorFolder}/get-list-${lowerCaseAggregateName}.usecase.types.ts`,
        fileContent,
    );
}
