import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../utils/string';
export function createAggregateDTOFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/dtos`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer.writeLine(`import { Nullable } from '@heronjs/common';`);

    writer.writeLine(`export type ${aggregateClassName}Dto = {`);
    properties.forEach((property: any) => {
        writer.writeLine(`${Space4x}${property.key}: ${property.value};`);
    });

    writer.writeLine(`};`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.dto.ts`, fileContent);
}
