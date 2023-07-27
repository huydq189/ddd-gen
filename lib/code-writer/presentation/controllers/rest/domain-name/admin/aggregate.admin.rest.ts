import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../../../utils/create-folder-if-not-exists';
import {
    Space12x,
    Space16x,
    Space20x,
    Space4x,
    Space8x,
    createClassName,
} from '../../../../../../utils/string';
export function createAggregatePresentationFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/presentation/controllers/rest/${domainName.toLowerCase()}/admin`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { SortInput } from '@cbidigital/aqua';`)
        .writeLine(
            `import { Body, Delete, Fuse, Get, Param, Patch, Post, Query, Rest } from '@heronjs/common';`,
        )
        .writeLine(`import { StatusCodes } from 'http-status-codes';`)
        .writeLine(`import { InjectTokens } from '../../../../../../../constants';`)
        .writeLine(`import {`)
        .writeLine(`${Space4x}Create${aggregateClassName}UseCaseInput,`)
        .writeLine(`${Space4x}ICreate${aggregateClassName}UseCase,`)
        .writeLine(`${Space4x}IDelete${aggregateClassName}UseCase,`)
        .writeLine(`${Space4x}IGetList${aggregateClassName}UseCase,`)
        .writeLine(`${Space4x}IGet${aggregateClassName}UseCase,`)
        .writeLine(`${Space4x}ISoftDelete${aggregateClassName}UseCase,`)
        .writeLine(`${Space4x}IUpdate${aggregateClassName}UseCase,`)
        .writeLine(`${Space4x}Update${aggregateClassName}UseCaseInput,`)
        .writeLine(`${Space4x}ICountList${aggregateClassName}UseCase,`)
        .writeLine(`} from '../../../../../app';`)
        .blankLine();

    writer.writeLine(`@Rest('/admin/${lowerCaseAggregateName}s')`);
    writer
        .writeLine(`export class ${aggregateClassName}AdminRest {`)
        .writeLine(`${Space4x}@Get({ uri: '/count' })`)
        .writeLine(`${Space4x}public async count(`)
        .writeLine(
            `${Space8x}@Fuse(InjectTokens.UseCase.COUNT_LIST_${upperCaseAggregateName}) useCase: ICountList${aggregateClassName}UseCase,`,
        )
        .writeLine(`${Space8x}@Query('filter') filter: any,`)
        .writeLine(`${Space8x}@Query('eavFilter') eavFilter: any,`)
        .writeLine(`${Space8x}@Query('offset') offset: number,`)
        .writeLine(`${Space8x}@Query('limit') limit: number,`)
        .writeLine(`${Space8x}@Query('sort') sort: SortInput,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}return useCase.exec(`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}offset,`)
        .writeLine(`${Space16x}limit,`)
        .writeLine(`${Space16x}sort,`)
        .writeLine(`${Space16x}filter,`)
        .writeLine(`${Space16x}eavFilter,`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}auth: {`)
        .writeLine(`${Space20x}isAdmin: true,`)
        .writeLine(`${Space16x}},`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x});`)
        .writeLine(`${Space4x}}`)
        .writeLine(`${Space4x}@Post({ uri: '/', code: StatusCodes.CREATED })`)
        .writeLine(`${Space4x}public async create(`)
        .writeLine(
            `${Space8x}@Fuse(InjectTokens.UseCase.CREATE_${upperCaseAggregateName}) useCase: ICreate${aggregateClassName}UseCase,`,
        )
        .writeLine(`${Space8x}@Body() body: Create${aggregateClassName}UseCaseInput,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}return useCase.exec(body, {`)
        .writeLine(`${Space12x}auth: {`)
        .writeLine(`${Space16x}isAdmin: true,`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x}});`)
        .writeLine(`${Space4x}}`)
        .blankLine()
        .writeLine(`${Space4x}@Patch({ uri: '/:id', code: StatusCodes.NO_CONTENT })`)
        .writeLine(`${Space4x}public async update(`)
        .writeLine(
            `${Space8x}@Fuse(InjectTokens.UseCase.UPDATE_${upperCaseAggregateName}) useCase: IUpdate${aggregateClassName}UseCase,`,
        )
        .writeLine(`${Space8x}@Body() body: Update${aggregateClassName}UseCaseInput,`)
        .writeLine(`${Space8x}@Param('id') id: string,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}return useCase.exec(`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}...body,`)
        .writeLine(`${Space16x}id,`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}auth: {`)
        .writeLine(`${Space20x}isAdmin: true,`)
        .writeLine(`${Space16x}},`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x});`)
        .writeLine(`${Space4x}}`)
        .blankLine()
        .writeLine(`${Space4x}@Delete({ uri: '/soft/:id', code: StatusCodes.NO_CONTENT })`)
        .writeLine(`${Space4x}public async softDelete(`)
        .writeLine(
            `${Space8x}@Fuse(InjectTokens.UseCase.SOFT_DELETE_${upperCaseAggregateName}) useCase: ISoftDelete${aggregateClassName}UseCase,`,
        )
        .writeLine(`${Space8x}@Param('id') id: string,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}return useCase.exec(`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}id,`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}auth: {`)
        .writeLine(`${Space20x}isAdmin: true,`)
        .writeLine(`${Space16x}},`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x});`)
        .writeLine(`${Space4x}}`)
        .blankLine()
        .writeLine(`${Space4x}@Delete({ uri: '/:id', code: StatusCodes.NO_CONTENT })`)
        .writeLine(`${Space4x}public async delete(`)
        .writeLine(
            `${Space8x}@Fuse(InjectTokens.UseCase.DELETE_${upperCaseAggregateName}) useCase: IDelete${aggregateClassName}UseCase,`,
        )
        .writeLine(`${Space8x}@Param('id') id: string,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}return useCase.exec(`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}id,`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}auth: {`)
        .writeLine(`${Space20x}isAdmin: true,`)
        .writeLine(`${Space16x}},`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x});`)
        .writeLine(`${Space4x}}`)
        .blankLine()
        .writeLine(`${Space4x}@Get({ uri: '/:id' })`)
        .writeLine(`${Space4x}public async getById(`)
        .writeLine(
            `${Space8x}@Fuse(InjectTokens.UseCase.GET_${upperCaseAggregateName}_BY_ID) useCase: IGet${aggregateClassName}UseCase,`,
        )
        .writeLine(`${Space8x}@Param('id') id: string,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}return useCase.exec(`)
        .writeLine(`${Space12x}{ id },`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}auth: {`)
        .writeLine(`${Space20x}isAdmin: true,`)
        .writeLine(`${Space16x}},`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x});`)
        .writeLine(`${Space4x}}`)
        .blankLine()
        .writeLine(`${Space4x}@Get({ uri: '/' })`)
        .writeLine(`${Space4x}public async getList(`)
        .writeLine(
            `${Space8x}@Fuse(InjectTokens.UseCase.GET_LIST_${upperCaseAggregateName}) useCase: IGetList${aggregateClassName}UseCase,`,
        )
        .writeLine(`${Space8x}@Query('filter') filter: any,`)
        .writeLine(`${Space8x}@Query('eavFilter') eavFilter: any,`)
        .writeLine(`${Space8x}@Query('offset') offset: number,`)
        .writeLine(`${Space8x}@Query('limit') limit: number,`)
        .writeLine(`${Space8x}@Query('sort') sort: SortInput,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}return useCase.exec(`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}offset,`)
        .writeLine(`${Space16x}limit,`)
        .writeLine(`${Space16x}sort,`)
        .writeLine(`${Space16x}filter,`)
        .writeLine(`${Space16x}eavFilter,`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space12x}{`)
        .writeLine(`${Space16x}auth: {`)
        .writeLine(`${Space20x}isAdmin: true,`)
        .writeLine(`${Space16x}},`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x});`)
        .writeLine(`${Space4x}}`)
        .writeLine(`}`);
    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    const aggregatePresentationFolder = `src/features/${domainName.toLowerCase()}/presentation`;

    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.admin.rest.ts`, fileContent);
    fs.writeFileSync(`${aggregatePresentationFolder}/index.ts`, `export * from './controllers';`);
    fs.writeFileSync(`${aggregatePresentationFolder}/controllers/index.ts`, `export * from './rest';`);
    fs.writeFileSync(
        `${aggregatePresentationFolder}/controllers/rest/index.ts`,
        `export * from './${domainName.toLowerCase()}';`,
    );
    fs.writeFileSync(
        `${aggregatePresentationFolder}/controllers/rest/${domainName.toLowerCase()}/index.ts`,
        `export * from './admin';`,
    );

    if (!fs.existsSync(aggregateFolder + 'index.ts')) {
        const writer = new mod.default({
            // optional options
            useTabs: false, // default: false
            useSingleQuote: true, // default: false
        });
        writer.writeLine(`export * from './${lowerCaseAggregateName}.admin.rest.ts';`);
        const fileContent = writer.toString();
        fs.writeFileSync(`${aggregateFolder}/index.ts`, fileContent);
        return;
    }
    const fileIndexContent = fs.readFileSync(`${aggregateFolder}/index.ts`, 'utf8');
    if (!fileIndexContent.includes(`export * from './${lowerCaseAggregateName}.admin.rest.ts';`)) {
        fs.appendFileSync(
            `${aggregateFolder}/index.ts`,
            `export * from './${lowerCaseAggregateName}.admin.rest.ts';`,
        );
    }
}
