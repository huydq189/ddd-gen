import * as mod from 'code-block-writer';
import fs from 'fs';
import { Space12x, Space4x, Space8x } from '../../../../../utils';
import { createFolderIfNotExists } from '../../../../../utils/create-folder-if-not-exists';
import { Space16x, createClassName } from '../../../../../utils/string';

export function createAggregateGetByIdUseCaseFile(input: {
    aggregateName: string;
    domainName: string;
    properties: { key: string; value: string }[];
}) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateErrorFolder = `src/features/${domainName.toLowerCase()}/app/usecases/${lowerCaseAggregateName}/query`;
    createFolderIfNotExists(aggregateErrorFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { IUseCase, ResultOf, UseCase, UseCaseContext } from '@cbidigital/aqua';`)
        .writeLine(`import { Inject, Provider, Lifecycle } from '@heronjs/common';`)
        .writeLine(`import { InjectTokens } from '../../../../../../constants';`)
        .writeLine(`import { ${aggregateClassName}NotFoundError } from '../../../../domain';`)
        .writeLine(`import { IUnitDAO } from '../../../../infra';`)
        .writeLine(
            `import { GetUnitUseCaseInput, GetUnitUseCaseInputSchema, GetUnitUseCaseOutput } from './types';`,
        )
        .blankLine();

    writer
        .writeLine(
            `export type IGetUnitUseCase = IUseCase<GetUnitUseCaseInput, GetUnitUseCaseOutput, UseCaseContext>;`,
        )
        .blankLine();

    writer
        .writeLine(
            `@Provider({ token: InjectTokens.UseCase.GET_${upperCaseAggregateName}, scope: Lifecycle.Transient })`,
        )
        .writeLine(`export class Get${aggregateClassName}UseCase<`)
        .writeLine(
            `${Space8x}I extends Get${aggregateClassName}UseCaseInput = Get${aggregateClassName}UseCaseInput,`,
        )
        .writeLine(
            `${Space8x}O extends Get${aggregateClassName}UseCaseOutput = Get${aggregateClassName}UseCaseOutput,`,
        )
        .writeLine(`${Space8x}C extends UseCaseContext = UseCaseContext,`)
        .writeLine(`${Space4x}>`)
        .writeLine(`${Space4x}extends UseCase<I, O, C>`)
        .writeLine(`${Space4x}implements IGet${aggregateClassName}UseCase`)
        .writeLine(`{`)
        .writeLine(`${Space4x}constructor(`)
        .writeLine(
            `${Space8x}@Inject(InjectTokens.Dao.${upperCaseAggregateName}) protected readonly dao: I${aggregateClassName}DAO) {`,
        )
        .writeLine(`${Space8x}super();`)
        .writeLine(`${Space8x}this.setMethods(this.validate, this.processing, this.map);`)
        .writeLine(`${Space4x}}`)
        .writeLine(`${Space4x}validate = async (input: I) => {`)
        .writeLine(`${Space8x}return GetUnitUseCaseInputSchema.parse(input);`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}processing = async (input: ResultOf<Get${aggregateClassName}UseCase, 'validate'>) => {`,
        )
        .writeLine(`${Space8x}const dto = await this.dao.findOne({`)
        .writeLine(`${Space12x}filter: {`)
        .writeLine(`${Space16x}id: { $eq: input.id },`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x}});`)
        .writeLine(`${Space8x}if (!dto) throw new UnitNotFoundError();`)
        .writeLine(`${Space8x}return dto;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}map = async (dtos: ResultOf<Get${aggregateClassName}UseCase, 'processing'>) => {`,
        )
        .writeLine(`${Space8x}const result: GetUnitUseCaseOutput = {`)
        .writeLine(`${Space12x}...dto,`)
        .writeLine(`${Space8x}};`)
        .writeLine(`${Space8x}return <O>result;`)
        .writeLine(`${Space4x}};`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/get-${lowerCaseAggregateName}-by-id.usecase.ts`, fileContent);
}
