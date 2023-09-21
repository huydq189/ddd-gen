import * as mod from 'code-block-writer';
import fs from 'fs';
import { Space12x, Space4x, Space8x } from '../../../../../utils';
import { createFolderIfNotExists } from '../../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../../utils/string';

export function createAggregateUpdateUseCaseFile(input: {
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
            `import { Update${aggregateClassName}UseCaseInput, update${aggregateClassName}UseCaseInputSchema, Update${aggregateClassName}UseCaseOutput } from './types';`,
        )
        .blankLine();

    writer
        .writeLine(
            `export type IUpdate${aggregateClassName}UseCase = IUseCase<Update${aggregateClassName}UseCaseInput, Update${aggregateClassName}UseCaseOutput, UseCaseContext>;`,
        )
        .blankLine();

    writer
        .writeLine(
            `@Provider({ token: ${upperCaseAggregateName}_INJECT_TOKENS.USECASE.UPDATE_${upperCaseAggregateName}, scope: Lifecycle.Transient })`,
        )
        .writeLine(`export class Update${aggregateClassName}UseCase<`)
        .writeLine(
            `${Space8x}I extends Update${aggregateClassName}UseCaseInput = Update${aggregateClassName}UseCaseInput,`,
        )
        .writeLine(
            `${Space8x}O extends Update${aggregateClassName}UseCaseOutput = Update${aggregateClassName}UseCaseOutput,`,
        )
        .writeLine(`${Space8x}C extends UseCaseContext = UseCaseContext,`)
        .writeLine(`${Space4x}>`)
        .writeLine(`${Space4x}extends UseCase<I, O, C>`)
        .writeLine(`${Space4x}implements IUpdate${aggregateClassName}UseCase`)
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
            `${Space8x}return ValidatorUtil.parse(update${aggregateClassName}UseCaseInputSchema, input);`,
        )
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}processing = async (input: ResultOf<Update${aggregateClassName}UseCase, 'validate'>) => {`,
        )
        .writeLine(`${Space8x}const entity = await this.repo.getById(input.id);`)
        .writeLine(`${Space8x}await entity.update(input);`)
        .writeLine(`${Space8x}return entity;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}save = async (entity: ResultOf<Update${aggregateClassName}UseCase, 'processing'>) => {`,
        )
        .writeLine(`${Space8x}await this.repo.update(entity);`)
        .writeLine(`${Space8x}return entity;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}map = async (entity: ResultOf<Update${aggregateClassName}UseCase, 'save'>) => {`,
        )
        .writeLine(`${Space8x}return <O>undefined;`)
        .writeLine(`${Space4x}};`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/update-${lowerCaseAggregateName}.usecase.ts`, fileContent);
}
