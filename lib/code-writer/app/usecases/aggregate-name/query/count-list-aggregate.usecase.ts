import * as mod from 'code-block-writer';
import fs from 'fs';
import { Space12x, Space4x, Space8x } from '../../../../../utils';
import { createFolderIfNotExists } from '../../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../../utils/string';

export function createAggregateCountListUseCaseFile(input: {
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
        .writeLine(
            `import { IUseCase, PaginationUtil, ResultOf, UseCase, UseCaseContext } from '@cbidigital/aqua';`,
        )
        .writeLine(`import { Inject, Provider, Scope } from '@heronjs/common';`)
        .writeLine(`import { InjectTokens } from '../../../../../../constants';`)
        .writeLine(`import { ${aggregateClassName}DTO } from '../../../../domain';`)
        .writeLine(`import { I${aggregateClassName}DAO } from '../../../../infra/databases';`)
        .writeLine(
            `import { CountList${aggregateClassName}UseCaseInput, CountList${aggregateClassName}UseCaseOutput } from './types';`,
        )
        .blankLine();

    writer
        .writeLine(`export type ICountList${aggregateClassName}UseCase = IUseCase<`)
        .writeLine(`${Space4x}CountList${aggregateClassName}UseCaseInput,`)
        .writeLine(`${Space4x}CountList${aggregateClassName}UseCaseOutput,`)
        .writeLine(`${Space4x}UseCaseContext`)
        .writeLine(`>;`)
        .blankLine();

    writer
        .writeLine(
            `@Provider({ token: InjectTokens.UseCase.COUNT_LIST_${upperCaseAggregateName}, scope: Scope.REQUEST })`,
        )
        .writeLine(`export class CountList${aggregateClassName}UseCase<`)
        .writeLine(
            `${Space8x}I extends CountList${aggregateClassName}UseCaseInput = CountList${aggregateClassName}UseCaseInput,`,
        )
        .writeLine(
            `${Space8x}O extends CountList${aggregateClassName}UseCaseOutput = CountList${aggregateClassName}UseCaseOutput,`,
        )
        .writeLine(`${Space8x}C extends UseCaseContext = UseCaseContext,`)
        .writeLine(`${Space4x}>`)
        .writeLine(`${Space4x}extends UseCase<I, O, C>`)
        .writeLine(`${Space4x}implements ICountList${aggregateClassName}UseCase`)
        .writeLine(`{`)
        .writeLine(
            `${Space4x}constructor(@Inject(InjectTokens.Dao.${upperCaseAggregateName}) protected readonly _dao: I${aggregateClassName}DAO) {`,
        )
        .writeLine(`${Space8x}super();`)
        .writeLine(`${Space8x}this.setMethods(this.validate, this.processing, this.map);`)
        .writeLine(`${Space4x}}`)
        .writeLine(`${Space4x}validate = async (input: I) => {`)
        .writeLine(`${Space8x}const model = PaginationUtil.transform<${aggregateClassName}DTO>(input);`)
        .writeLine(`${Space8x}return model;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}processing = async (input: ResultOf<CountList${aggregateClassName}UseCase, 'validate'>) => {`,
        )
        .writeLine(`${Space8x}return this._dao.count(input);`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}map = async (dtos: ResultOf<CountList${aggregateClassName}UseCase, 'processing'>) => {`,
        )
        .writeLine(`${Space8x}return {`)
        .writeLine(`${Space12x}totalCount,`)
        .writeLine(`${Space8x}} as O;`)
        .writeLine(`${Space4x}};`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/count-list-${lowerCaseAggregateName}.usecase.ts`, fileContent);
}
