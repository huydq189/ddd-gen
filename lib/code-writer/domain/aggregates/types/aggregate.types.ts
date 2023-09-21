// import { Nullable } from '@heronjs/common';

// export type CreateTodoInput = {
//     title: string;
//     description?: Nullable<string>;
// };

// export type UpdateTodoInput = Partial<CreateTodoInput> & { id: string };

// export type DeleteTodoInput = {
//     id: string;
// };

import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../utils/string';

export function createAggregateTypeFile(input: {
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

    writer.writeLine(`import { Nullable } from '@heronjs/common';`).blankLine();
    writer.writeLine(`export type Create${aggregateClassName}Input = {`);

    properties.forEach((property: any) => {
        if (
            property.key !== 'id' &&
            property.key !== 'createdAt' &&
            property.key !== 'updatedAt' &&
            property.key !== 'deletedAt'
        )
            writer.writeLine(`${Space4x}${property.key}: ${property.value};`);
    });
    writer.writeLine(`};`).blankLine();

    writer
        .writeLine(
            `export type Update${aggregateClassName}Input = Partial<Create${aggregateClassName}Input> & { id: string };`,
        )
        .blankLine();

    writer
        .writeLine(`export type Delete${aggregateClassName}Input = {`)
        .writeLine(`${Space4x}id: string;`)
        .writeLine(`};`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/${lowerCaseAggregateName}.types.ts`, fileContent);
}
