import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../../../utils/string';

// import { CreateUnitInput, CreateUnitInputSchema } from '../../../../../domain';

// export type CreateUnitUseCaseInput = CreateUnitInput;
// export const CreateUnitUseCaseInputSchema = CreateUnitInputSchema;
// export type CreateUnitUseCaseOutput = { id: string };

export function createAggregateCreateUseCaseTypeFile(input: {
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
        .writeLine(
            `import { Create${aggregateClassName}Input, Create${aggregateClassName}InputSchema } from '../../../../../domain';`,
        )
        .writeLine(`export type Create${aggregateClassName}UseCaseInput = Create${aggregateClassName}Input;`)
        .writeLine(
            `export const Create${aggregateClassName}UseCaseInputSchema = Create${aggregateClassName}InputSchema;`,
        )
        .writeLine(`export type Create${aggregateClassName}UseCaseOutput = { id: string };`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/create-${lowerCaseAggregateName}.types.ts`, fileContent);
}
