import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../../utils/string';
import { Space12x, Space4x, Space8x } from '../../../../../utils';

// import { CreateUnitInput, CreateUnitInputSchema } from '../../../../domain';

// export type CreateUnitUseCaseInput = CreateUnitInput;
// export const CreateUnitUseCaseInputSchema = CreateUnitInputSchema;
// export type CreateUnitUseCaseOutput = { id: string };

export function createAggregateCreateUseCaseFile(input: {
    aggregateName: string;
    domainName: string;
    properties: { key: string; value: string }[];
}) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/command`;
    createFolderIfNotExists(aggregateErrorFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(
            `import { IUseCase, ResultOf, UseCase, UseCaseContext, ValidatorUtil } from '@cbidigital/aqua';`,
        )
        .writeLine(`import { Inject, Provider, Lifecycle } from '@heronjs/common';`)
        .writeLine(`import { ${upperCaseAggregateName}_INJECT_TOKENS } from '../../../../../../constants';`)
        .writeLine(`import { I${aggregateClassName}Builder } from '../../../../domain';`)
        .writeLine(`import { I${aggregateClassName}Repository } from '../../../../domain/repositories';`)
        .writeLine(
            `import { Create${aggregateClassName}UseCaseInput, create${aggregateClassName}UseCaseInputSchema, Create${aggregateClassName}UseCaseOutput } from './types';`,
        )
        .blankLine();

    writer
        .writeLine(
            `export type ICreate${aggregateClassName}UseCase = IUseCase<Create${aggregateClassName}UseCaseInput, Create${aggregateClassName}UseCaseOutput, UseCaseContext>;`,
        )
        .blankLine();

    writer
        .writeLine(
            `@Provider({ token: ${upperCaseAggregateName}_INJECT_TOKENS.USECASE.CREATE_${upperCaseAggregateName}, scope: Lifecycle.Transient })`,
        )
        .writeLine(`export class Create${aggregateClassName}UseCase<`)
        .writeLine(
            `${Space8x}I extends Create${aggregateClassName}UseCaseInput = Create${aggregateClassName}UseCaseInput,`,
        )
        .writeLine(
            `${Space8x}O extends Create${aggregateClassName}UseCaseOutput = Create${aggregateClassName}UseCaseOutput,`,
        )
        .writeLine(`${Space8x}C extends UseCaseContext = UseCaseContext,`)
        .writeLine(`${Space4x}>`)
        .writeLine(`${Space4x}extends UseCase<I, O, C>`)
        .writeLine(`${Space4x}implements ICreate${aggregateClassName}UseCase`)
        .writeLine(`{`)
        .writeLine(`${Space4x}constructor(`)
        .writeLine(
            `${Space8x}@Inject(${upperCaseAggregateName}_INJECT_TOKENS.BUILDER.${upperCaseAggregateName}) protected readonly builder: I${aggregateClassName}Builder,`,
        )
        .writeLine(
            `${Space8x}@Inject(${upperCaseAggregateName}_INJECT_TOKENS.REPO.${upperCaseAggregateName}) protected readonly repo: I${aggregateClassName}Repository,`,
        )
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}super();`)
        .writeLine(`${Space8x}this.setMethods(this.validate, this.processing, this.save, this.map);`)
        .writeLine(`${Space4x}}`)
        .writeLine(`${Space4x}validate = async (input: I) => {`)
        .writeLine(
            `${Space8x}return ValidatorUtil.parse(create${aggregateClassName}UseCaseInputSchema, input);`,
        )
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}processing = async (input: ResultOf<Create${aggregateClassName}UseCase, 'validate'>) => {`,
        )
        .writeLine(`${Space8x}const entity = await this.builder.build();`)
        .writeLine(`${Space8x}await entity.create(input);`)
        .writeLine(`${Space8x}return entity;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}save = async (entity: ResultOf<Create${aggregateClassName}UseCase, 'processing'>) => {`,
        )
        .writeLine(`${Space8x}await this.repo.create(entity);`)
        .writeLine(`${Space8x}return entity;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}map = async (entity: ResultOf<Create${aggregateClassName}UseCase, 'save'>) => {`,
        )
        .writeLine(`${Space8x}return <O>{`)
        .writeLine(`${Space12x}id: entity.id,`)
        .writeLine(`${Space8x}};`)
        .writeLine(`${Space4x}};`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/create-${lowerCaseAggregateName}.usecase.ts`, fileContent);
}
