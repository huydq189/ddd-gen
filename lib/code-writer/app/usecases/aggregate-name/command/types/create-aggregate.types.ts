import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../../../utils/string';
import { generateZodSchemaLine, getType } from '../../../../../../utils/type';

// import { z } from 'zod';
// import { CreateTodoInput } from '../../../../domain';

// export type CreateTodoUseCaseInput = CreateTodoInput;

// export type CreateTodoUseCaseOutput = {
//     id: string;
// };

// export const createTodoUseCaseInputSchema = z.object({
//     title: z.string(),
//     description: z.string().nullable().optional(),
//     attributes: z.any(),
// });

export function createAggregateCreateUseCaseTypeFile(input: {
    aggregateName: string;
    domainName: string;
    properties: { key: string; value: string }[];
}) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/command/types`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { z } from 'zod';`)
        .writeLine(`import { Create${aggregateClassName}Input } from '../../../../../domain';`)
        .blankLine()
        .writeLine(`export type Create${aggregateClassName}UseCaseInput = Create${aggregateClassName}Input;`)
        .blankLine()
        .writeLine(`export type Create${aggregateClassName}UseCaseOutput = {`)
        .writeLine(`${Space4x}id: string;`)
        .writeLine(`};`)
        .writeLine(`export const create${aggregateClassName}UseCaseInputSchema = z.object({`);

    properties.forEach((property: any) => {
        const propertyType = getType(property.value);
        const zodSchemaLine = generateZodSchemaLine(propertyType.type, propertyType);
        if (
            property.key !== 'id' &&
            property.key !== 'createdAt' &&
            property.key !== 'updatedAt' &&
            property.key !== 'deletedAt'
        )
            writer.writeLine(`${Space4x}${property.key}: ${zodSchemaLine}`);
    });
    writer.writeLine(`});`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/create-${lowerCaseAggregateName}.types.ts`, fileContent);
}
