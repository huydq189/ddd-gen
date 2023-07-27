import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../utils/string';
import { generateZodSchemaLine, getType } from '../../../../utils/type';

// import { z } from 'zod';

// export const UpdateSubjectInputSchema = z.object({
//     name: z.string().trim().nonempty().optional(),
//     note: z.string().trim().nonempty().optional(),
//     targetId: z.string().uuid().optional(),
//     address: z.string().optional().nullable(),
// });

// export type UpdateSubjectInput = z.infer<typeof UpdateSubjectInputSchema>;
export function createAggregateUpdateInputFile(input: {
    aggregateName: string;
    domainName: string;
    properties: { key: string; value: string }[];
}) {
    const { aggregateName, domainName, properties } = input;
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
        .writeLine(`export const Update${aggregateClassName}InputSchema = z.object({`);
    properties.forEach((property: any) => {
        const propertyType = getType(property.value);
        const zodSchemaLine = generateZodSchemaLine(propertyType.type, { ...propertyType, optional: true });
        if (
            property.key !== 'id' &&
            property.key !== 'createdAt' &&
            property.key !== 'updatedAt' &&
            property.key !== 'deletedAt'
        )
            writer.writeLine(`${property.key}: ${zodSchemaLine}`);
    });
    writer.writeLine(`});`);
    writer.writeLine(
        `export type Update${aggregateClassName}Input = z.infer<typeof Update${aggregateClassName}InputSchema>;`,
    );

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/${lowerCaseAggregateName}-update.types.ts`, fileContent);
}
