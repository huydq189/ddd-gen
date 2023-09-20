import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';
import { Space4x, Space8x, capitalizeFirstLetter, createClassName } from '../../../utils/string';
export function createAggregateFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/domain/aggregates/${lowerCaseAggregateName}`;
    createFolderIfNotExists(aggregateErrorFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import {`)
        .writeLine(`${Space4x}AggregateRoot,`)
        .writeLine(`${Space4x}AggregateRootConstructorPayload,`)
        .writeLine(`${Space4x}EntityIdUtil,`)
        .writeLine(`${Space4x}IAggregateRoot,`)
        .writeLine(`} from '@cbidigital/aqua';`)
        .writeLine(`import { Nullable } from '@heronjs/common';`)
        .writeLine(`import { ${aggregateClassName}EventNames } from './consts';`)
        .writeLine(`import {`)
        .writeLine(`${Space4x}Create${aggregateClassName}Input,`)
        .writeLine(`${Space4x}Create${aggregateClassName}InputSchema,`)
        .writeLine(`${Space4x}Update${aggregateClassName}Input,`)
        .writeLine(`${Space4x}Update${aggregateClassName}InputSchema,`)
        .writeLine(`} from './types';`);

    writer.writeLine(`export type ${aggregateClassName}Props = {`);
    properties.forEach((property: any) => {
        if (
            property.key !== 'id' &&
            property.key !== 'createdAt' &&
            property.key !== 'updatedAt' &&
            property.key !== 'deletedAt'
        )
            writer.writeLine(`${Space4x}${property.key}: ${property.value};`);
    });
    writer
        .writeLine(`${Space4x}createdAt: Date;`)
        .writeLine(`${Space4x}updatedAt: Nullable<Date>;`)
        .writeLine(`${Space4x}deletedAt: Nullable<Date>;`)
        .writeLine(`};`);

    writer
        .writeLine(`export type ${aggregateClassName}Methods = {`)
        .writeLine(`${Space4x}create(payload: Create${aggregateClassName}Input): Promise<void>;`)
        .writeLine(`${Space4x}update(payload: Update${aggregateClassName}Input): Promise<void>;`)
        .writeLine(`${Space4x}delete(): Promise<void>;`)
        .writeLine(`};`);

    writer.writeLine(
        `export type I${aggregateClassName} = IAggregateRoot<${aggregateClassName}Props, ${aggregateClassName}Methods>;`,
    );

    writer
        .writeLine(
            `export class ${aggregateClassName} extends AggregateRoot<${aggregateClassName}Props, ${aggregateClassName}Methods> implements I${aggregateClassName} {`,
        )
        .writeLine(`${Space4x}static readonly AGGREGATE_NAME = '${aggregateName.toUpperCase()}';`)
        .blankLine()
        .writeLine(
            `${Space4x}constructor(payload: AggregateRootConstructorPayload<${aggregateClassName}Props>) {`,
        )
        .writeLine(`${Space8x}super(payload);`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    // get
    properties.forEach((property: any) => {
        if (property.key !== 'id')
            writer
                .writeLine(`${Space4x}public get ${property.key}(): ${property.value} {`)
                .writeLine(`${Space8x}return this.props.${property.key};`)
                .writeLine(`${Space4x}}`);
    });

    writer.blankLine();
    // set
    properties.forEach((property: any) => {
        if (property.key !== 'id')
            writer
                .writeLine(
                    `${Space4x}private set${capitalizeFirstLetter(property.key)}(payload?: ${
                        property.value
                    }) {`,
                )
                .writeLine(`${Space8x}if (payload !== undefined) this.props.${property.key} = payload;`)
                .writeLine(`${Space4x}}`);
    });

    // create

    writer
        .writeLine(
            `${Space4x}public async create(payload: Create${aggregateClassName}Input): Promise<void> {`,
        )
        .writeLine(`${Space8x}this.setId(EntityIdUtil.randomUUID());`)
        .writeLine(`${Space8x}this.setCode(EntityIdUtil.randomUUID());`);

    properties.forEach((property: any) => {
        if (
            property.key !== 'id' &&
            property.key !== 'code' &&
            property.key !== 'createdAt' &&
            property.key !== 'updatedAt' &&
            property.key !== 'deletedAt'
        )
            writer.writeLine(
                `${Space8x}this.set${capitalizeFirstLetter(property.key)}(model.${property.key});`,
            );
    });

    writer
        .writeLine(`${Space8x}this.setCreatedAt(new Date());`)
        .writeLine(`${Space8x}this.addDomainEvent(UnitEventNames.CREATE);`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    // update

    writer.writeLine(
        `${Space4x}public async update(payload: Update${aggregateClassName}Input): Promise<void> {`,
    );

    properties.forEach((property: any) => {
        if (
            property.key !== 'id' &&
            property.key !== 'code' &&
            property.key !== 'createdAt' &&
            property.key !== 'updatedAt' &&
            property.key !== 'deletedAt'
        )
            writer.writeLine(
                `${Space8x}this.set${capitalizeFirstLetter(property.key)}(model.${property.key});`,
            );
    });

    writer
        .writeLine(`${Space8x}this.setUpdatedAt(new Date());`)
        .writeLine(`${Space8x}this.addDomainEvent(UnitEventNames.UPDATE);`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    // delete

    writer
        .writeLine(`${Space4x}public async delete(): Promise<void> {`)
        .writeLine(`${Space8x}` + 'const deletedSuffix = `:deleted:${Date.now()}`;')
        .writeLine(`${Space8x}this.setCode(this.code + deletedSuffix);`)
        .writeLine(`${Space8x}this.setName(this.name + deletedSuffix);`)
        .writeLine(`${Space8x}this.setDeletedAt(new Date());`)
        .writeLine(`${Space8x}this.addDomainEvent(${aggregateClassName}EventNames.DELETE);`)
        .writeLine(`${Space4x}}`);

    writer.writeLine('}');

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/${lowerCaseAggregateName}.ts`, fileContent);
}
