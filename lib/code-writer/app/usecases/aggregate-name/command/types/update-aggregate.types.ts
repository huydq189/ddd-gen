import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../../../utils/string';

// import { z } from 'zod';
// import { UpdateUnitInputSchema } from '../../../../../domain';

// export const UpdateUnitUseCaseInputSchema = UpdateUnitInputSchema.extend({
//     id: z.string().uuid(),
// });

// export type UpdateUnitUseCaseInput = z.infer<typeof UpdateUnitUseCaseInputSchema>;

// export type UpdateUnitUseCaseOutput = void;

export function createAggregateUpdateUseCaseTypeFile(input: {
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
        useTabs: false, // default: false`
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { z } from 'zod';`)
        .writeLine(`import { Update${aggregateClassName}InputSchema } from '../../../../../domain';`)
        .writeLine(
            `export const Update${aggregateClassName}UseCaseInputSchema = Update${aggregateClassName}InputSchema.extend({`,
        )
        .writeLine(`${Space4x}id: z.string().uuid(),`)
        .writeLine(`});`)
        .writeLine(
            `export type Update${aggregateClassName}UseCaseInput = z.infer<typeof Update${aggregateClassName}UseCaseInputSchema>;`,
        )
        .writeLine(`export type Update${aggregateClassName}UseCaseOutput = void;`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/update-${lowerCaseAggregateName}.types.ts`, fileContent);
}
