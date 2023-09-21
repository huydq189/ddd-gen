import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../../../utils/string';

// import { z } from 'zod';
// import { TimesheetDto } from '../../../../domain/dtos';

// export const GetTimesheetUseCaseInputSchema = z.object({
//     id: z.string().uuid(),
// });
// export type GetTimesheetUseCaseInput = z.infer<typeof GetTimesheetUseCaseInputSchema>;
// export type GetTimesheetUseCaseOutput = Partial<TimesheetDto>;

export function createAggregateGetByIdUseCaseTypeFile(input: {
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
        .writeLine(`import { z } from 'zod';`)
        .writeLine(`import { ${aggregateClassName}Dto } from '../../../../domain/dtos';`)
        .writeLine(`export const get${aggregateClassName}UseCaseInputSchema = z.object({`)
        .writeLine(`${Space4x}id: z.string().uuid(),`)
        .writeLine(`});`)
        .writeLine(
            `export type Get${aggregateClassName}UseCaseInput = z.infer<typeof Get${aggregateClassName}UseCaseInputSchema>;`,
        )
        .writeLine(`export type Get${aggregateClassName}UseCaseOutput = Partial<${aggregateClassName}Dto>;`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/get-${lowerCaseAggregateName}-by-id.types.ts`, fileContent);
}
