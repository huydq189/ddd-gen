import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../../../utils/string';

export function createAggregateDeleteUseCaseTypeFile(input: {
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
        .writeLine(`import { Delete${aggregateClassName}Input } from '../../../../../domain';`)
        .blankLine()
        .writeLine(`export type Delete${aggregateClassName}UseCaseInput = Delete${aggregateClassName}Input;`)
        .blankLine()
        .writeLine(`export type Delete${aggregateClassName}UseCaseOutput = void;`)
        .writeLine(`export const delete${aggregateClassName}UseCaseInputSchema = z.object({`)
        .writeLine(`${Space4x}id: z.string().uuid(),`)
        .writeLine(`});`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/delete-${lowerCaseAggregateName}.types.ts`, fileContent);
}
