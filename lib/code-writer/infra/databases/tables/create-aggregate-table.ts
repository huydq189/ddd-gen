import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { Space4x, createClassName } from '../../../../utils/string';
export function createAggregateDaoFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/infra/databases/tables`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { BaseTable, Column, TABLE_FIELD_DEFAULT_VALUE, Table } from '@cbidigital/aqua';`)
        .writeLine(`import { Nullable } from '@heronjs/common';`)
        .writeLine(`import { TableNames } from '../../../../../constants';`)
        .writeLine(`import { ${aggregateClassName}Dto } from '../../../domain';`)
        .blankLine();

    writer
        .writeLine(`@Table({`)
        .writeLine(`${Space4x}name: TableNames.${upperCaseAggregateName},`)
        .writeLine(`})`);

    writer
        .writeLine(
            `export class ${aggregateClassName}Table extends BaseTable<${aggregateClassName}Dto> implements ${aggregateClassName}Dto {`,
        )
        .writeLine(`${Space4x}@Column()`)
        .writeLine(`${Space4x}public id: string = TABLE_FIELD_DEFAULT_VALUE;`);

    properties.forEach((property: any) => {
        if (property.key !== 'id')
            writer
                .writeLine(`${Space4x}@Column()`)
                .writeLine(
                    `${Space4x}public ${property.key}: ${property.value} = TABLE_FIELD_DEFAULT_VALUE;`,
                );
    });

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.table.ts`, fileContent);
}
