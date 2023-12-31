import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';
import { Space12x, Space16x, Space4x, Space8x, createClassName } from '../../../utils/string';
export function createAggregateMapperFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/mappers`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { BaseMapper, IMapper } from '@cbidigital/aqua';`)
        .writeLine(`import { Inject, Provider, Lifecycle } from '@heronjs/common';`)
        .writeLine(`import { ${upperCaseAggregateName}_INJECT_TOKENS } from '../../../../constants';`)
        .writeLine(`import { I${aggregateClassName} } from '../aggregates';`)
        .writeLine(`import { I${aggregateClassName}Builder } from '../builders';`)
        .writeLine(`import { ${aggregateClassName}Dto } from '../dtos';`)
        .blankLine();

    writer
        .writeLine(
            `export type I${aggregateClassName}Mapper = IMapper<${aggregateClassName}Dto, I${aggregateClassName}>;`,
        )
        .blankLine();

    writer
        .writeLine(
            `@Provider({ token: ${upperCaseAggregateName}_INJECT_TOKENS.MAPPER.${upperCaseAggregateName}, scope: Lifecycle.Singleton })`,
        )
        .writeLine(
            `export class ${aggregateClassName}Mapper extends BaseMapper implements I${aggregateClassName}Mapper {`,
        )
        .writeLine(`${Space4x}constructor(`)
        .writeLine(
            `${Space8x}@Inject(${upperCaseAggregateName}_INJECT_TOKENS.BUILDER.${upperCaseAggregateName})`,
        )
        .writeLine(`${Space8x}protected readonly ${aggregateName}Builder: I${aggregateClassName}Builder,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}super();`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    writer
        .writeLine(
            `${Space4x}async fromEntityToDto(entity: I${aggregateClassName}): Promise<${aggregateClassName}Dto> {`,
        )
        .writeLine(`${Space8x}return {`);
    properties.forEach((property: any) => {
        writer.writeLine(`${Space12x}${property.key}: entity.${property.key},`);
    });
    writer.writeLine(`${Space8x}};`).writeLine(`${Space4x}}`).blankLine();

    writer
        .writeLine(
            `${Space4x}async fromDtoToEntity(dto: ${aggregateClassName}Dto): Promise<I${aggregateClassName}> {`,
        )
        .writeLine(`${Space8x}return this.${aggregateName}Builder.build({`)
        .writeLine(`${Space12x}id: dto.id,`)
        .writeLine(`${Space12x}props: {`);
    properties.forEach((property: any) => {
        if (property.key !== 'id') writer.writeLine(`${Space16x}${property.key}: dto.${property.key},`);
    });

    writer.writeLine(`${Space12x}},`).writeLine(`${Space8x}});`).writeLine(`${Space4x}}`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.mapper.ts`, fileContent);
}
