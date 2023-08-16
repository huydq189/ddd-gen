import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../../../utils/string';

// import { DeleteUnitInput, DeleteUnitInputSchema } from '../../../../../domain';

// export type DeleteUnitUseCaseInput = DeleteUnitInput;
// export const DeleteUnitUseCaseInputSchema = DeleteUnitInputSchema;
// export type DeleteUnitUseCaseOutput = void;

export function createAggregateDeleteUseCaseTypeFile(input: {
    aggregateName: string;
    domainName: string;
    properties: { key: string; value: string }[];
}) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/command/types`;
    createFolderIfNotExists(aggregateErrorFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { z } from 'zod';`)
        .writeLine(
            `import { Delete${aggregateClassName}Input, Delete${aggregateClassName}InputSchema } from '../../../../../domain';`,
        )
        .writeLine(`export type Delete${aggregateClassName}UseCaseInput = Delete${aggregateClassName}Input;`)
        .writeLine(
            `export const Delete${aggregateClassName}UseCaseInputSchema = Delete${aggregateClassName}InputSchema.extend({`,
        )
        .writeLine(`${Space4x}id: z.string().uuid(),`)
        .writeLine(`});`)
        .writeLine(`export type Delete${aggregateClassName}UseCaseOutput = void;`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/delete-${lowerCaseAggregateName}.types.ts`, fileContent);
}
