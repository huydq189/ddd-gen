import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../utils/string';

// import { z } from 'zod';

// export const DeleteSubjectInputSchema = z.object({
//   id: z.string().uuid(),
// });

// export type DeleteSubjectInput = z.infer<typeof DeleteSubjectInputSchema>;

export function createAggregateDeleteInputFile(input: {
    aggregateName: string;
    domainName: string;
    properties: { key: string; value: string }[];
}) {
    const { aggregateName, domainName } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}/types`;
    createFolderIfNotExists(aggregateErrorFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { z } from 'zod';`)
        .writeLine(`export const Delete${aggregateClassName}InputSchema = z.object({`)
        .writeLine(`id: z.string().uuid(),`)
        .writeLine(`});`)
        .writeLine(
            `export type Delete${aggregateClassName}Input = z.infer<typeof Delete${aggregateClassName}InputSchema>;`,
        );

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/${lowerCaseAggregateName}-delete.types.ts`, fileContent);
}
