import * as mod from 'code-block-writer';
import fs from 'fs';
import { Space4x, Space8x } from '../../../../../utils';
import { createFolderIfNotExists } from '../../../../../utils/create-folder-if-not-exists';
import { createClassName } from '../../../../../utils/string';

export function createAggregateDeleteUseCaseFile(input: {
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
        .writeLine(`import { IUseCase, ResultOf, UseCase, UseCaseContext } from '@cbidigital/aqua';`)
        .writeLine(`import { Inject, Provider, Scope } from '@heronjs/common';`)
        .writeLine(`import { InjectTokens } from '../../../../../../constants';`)
        .writeLine(`import { I${aggregateClassName}Builder } from '../../../../domain';`)
        .writeLine(`import { I${aggregateClassName}Repository } from '../../../../domain/repositories';`)
        .writeLine(
            `import { Delete${aggregateClassName}UseCaseInput, Delete${aggregateClassName}UseCaseInputSchema, Delete${aggregateClassName}UseCaseOutput } from './types';`,
        )
        .blankLine();

    writer
        .writeLine(
            `export type IDelete${aggregateClassName}UseCase = IUseCase<Delete${aggregateClassName}UseCaseInput, Delete${aggregateClassName}UseCaseOutput, UseCaseContext>;`,
        )
        .blankLine();

    writer
        .writeLine(
            `@Provider({ token: InjectTokens.UseCase.DELETE_${upperCaseAggregateName}, scope: Scope.REQUEST })`,
        )
        .writeLine(`export class Delete${aggregateClassName}UseCase<`)
        .writeLine(
            `${Space8x}I extends Delete${aggregateClassName}UseCaseInput = Delete${aggregateClassName}UseCaseInput,`,
        )
        .writeLine(
            `${Space8x}O extends Delete${aggregateClassName}UseCaseOutput = Delete${aggregateClassName}UseCaseOutput,`,
        )
        .writeLine(`${Space8x}C extends UseCaseContext = UseCaseContext,`)
        .writeLine(`${Space4x}>`)
        .writeLine(`${Space4x}extends UseCase<I, O, C>`)
        .writeLine(`${Space4x}implements IDelete${aggregateClassName}UseCase`)
        .writeLine(`{`)
        .writeLine(`${Space4x}constructor(`)
        .writeLine(
            `${Space8x}@Inject(InjectTokens.Builder.${upperCaseAggregateName}) protected readonly _builder: I${aggregateClassName}Builder,`,
        )
        .writeLine(
            `${Space8x}@Inject(InjectTokens.Repo.${upperCaseAggregateName}) protected readonly _repo: I${aggregateClassName}Repository,`,
        )
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}super();`)
        .writeLine(`${Space8x}this.setMethods(this.validate, this.processing, this.save, this.map);`)
        .writeLine(`${Space4x}}`)
        .writeLine(`${Space4x}validate = async (input: I) => {`)
        .writeLine(`${Space8x}return Delete${aggregateClassName}UseCaseInputSchema.parse(input);`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}processing = async (input: ResultOf<Delete${aggregateClassName}UseCase, 'validate'>) => {`,
        )
        .writeLine(`${Space8x}const entity = await this._repo.getById(input.id);`)
        .writeLine(`${Space8x}await entity.delete();`)
        .writeLine(`${Space8x}return entity;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}save = async (entity: ResultOf<Delete${aggregateClassName}UseCase, 'processing'>) => {`,
        )
        .writeLine(`${Space8x}await this._repo.delete(entity);`)
        .writeLine(`${Space8x}return entity;`)
        .writeLine(`${Space4x}};`)
        .writeLine(
            `${Space4x}map = async (entity: ResultOf<Delete${aggregateClassName}UseCase, 'save'>) => {`,
        )
        .writeLine(`${Space8x}return <O>undefined;`)
        .writeLine(`${Space4x}};`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateErrorFolder}/${lowerCaseAggregateName}-delete.usecase.ts`, fileContent);
}

// import { Inject, Provider, Scope } from '@heronjs/common';
// import { IUseCase, ResultOf, UseCase, UseCaseContext } from '@cbidigital/aqua';
// import { AccountModuleInjectTokens } from '../../../../../../constants';
// import { IAccountRepository } from '../../../../domain/repositories';
// import {
//     UpdateAccountUseCaseInput,
//     UpdateAccountUseCaseInputSchema,
//     UpdateAccountUseCaseOutput,
// } from './types';

// export type IUpdateAccountUseCase = IUseCase<
//     UpdateAccountUseCaseInput,
//     UpdateAccountUseCaseOutput,
//     UseCaseContext
// >;

// @Provider({ token: AccountModuleInjectTokens.UseCase.UPDATE_ACCOUNT, scope: Scope.REQUEST })
// export class UpdateAccountUseCase<
//         I extends UpdateAccountUseCaseInput = UpdateAccountUseCaseInput,
//         O extends UpdateAccountUseCaseOutput = UpdateAccountUseCaseOutput,
//         C extends UseCaseContext = UseCaseContext,
//     >
//     extends UseCase<I, O, C>
//     implements IUpdateAccountUseCase
// {
//     constructor(
//         @Inject(AccountModuleInjectTokens.Repo.ACCOUNT) protected readonly _repo: IAccountRepository,
//     ) {
//         super();
//         this.setMethods(this.validate, this.processing, this.save, this.map);
//     }

//     validate = async (input: I) => {
//         return UpdateAccountUseCaseInputSchema.parse(input);
//     };

//     processing = async (input: ResultOf<UpdateAccountUseCase, 'validate'>) => {
//         const account = await this._repo.getById(input.id);
//         await account.update(input);
//         return account;
//     };

//     save = async (entity: ResultOf<UpdateAccountUseCase, 'processing'>) => {
//         await this._repo.update(entity);
//         return entity;
//     };

//     map = async () => {
//         return <O>undefined;
//     };
// }
