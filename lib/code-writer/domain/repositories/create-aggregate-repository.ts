import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';
import { Space12x, Space16x, Space20x, Space4x, Space8x, createClassName } from '../../../utils/string';
export function createAggregateRepositoryFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/repositories`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(
            `import { BaseRepository, IRepository, QueryInput, RepositoryOptions } from '@cbidigital/aqua';`,
        )
        .writeLine(`import { Inject, Optional, Repository, Lifecycle } from '@heronjs/common';`)
        .writeLine(`import { InjectTokens } from '../../../../constants';`)
        .writeLine(`import { I${aggregateClassName}Dao } from '../../infra';`)
        .writeLine(`import { I${aggregateClassName} } from '../aggregates';`)
        .writeLine(
            `import { ${aggregateClassName}NotFoundError } from '../aggregates/${lowerCaseAggregateName}/errors';`,
        )
        .writeLine(`import { ${aggregateClassName}Dto } from '../dtos';`)
        .writeLine(`import { I${aggregateClassName}Mapper } from '../mappers';`)
        .blankLine();

    writer
        .writeLine(`export type I${aggregateClassName}Repository = IRepository<I${aggregateClassName}>;`)
        .blankLine();

    writer
        .writeLine(
            `@Repository({ token: InjectTokens.Repo.${upperCaseAggregateName}, scope: Lifecycle.Singleton })`,
        )
        .writeLine(
            `export class ${aggregateClassName}Repository extends BaseRepository<I${aggregateClassName}> implements I${aggregateClassName}Repository {`,
        )
        .writeLine(`${Space4x}constructor(`)
        .writeLine(`${Space8x}@Inject(InjectTokens.Mapper.${upperCaseAggregateName})`)
        .writeLine(`${Space8x}private ${lowerCaseAggregateName}Mapper: I${aggregateClassName}Mapper,`)
        .writeLine(`${Space8x}@Inject(InjectTokens.Dao.${upperCaseAggregateName})`)
        .writeLine(`${Space8x}private ${lowerCaseAggregateName}Dao: I${aggregateClassName}Dao,`)
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}super(_${lowerCaseAggregateName}Mapper, ${lowerCaseAggregateName}Dao);`)
        .writeLine(`${Space4x}}`);

    //create
    writer
        .writeLine(
            `${Space4x}public async create(entity: I${aggregateClassName}, options?: RepositoryOptions): Promise<I${aggregateClassName}> {`,
        )
        .writeLine(
            `${Space8x}const dto = await this.${lowerCaseAggregateName}Mapper.fromEntityToDto(entity);`,
        )
        .writeLine(
            `${Space8x}const trx = options?.trx ?? (await this.${lowerCaseAggregateName}Dao.startTrx());`,
        )
        .writeLine(`${Space8x}try {`)
        .writeLine(`${Space12x}await this.${lowerCaseAggregateName}Dao.create(dto, { trx });`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.commitTrx(trx);`)
        .writeLine(`${Space12x}entity.dispatchDomainEvents();`)
        .writeLine(`${Space12x}return entity;`)
        .writeLine(`${Space8x}} catch (error) {`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.rollbackTrx(trx);`)
        .writeLine(`${Space12x}throw error;`)
        .writeLine(`${Space8x}}`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    // update
    writer
        .writeLine(
            `${Space4x}public async update(entity: I${aggregateClassName}, options?: RepositoryOptions): Promise<I${aggregateClassName}> {`,
        )
        .writeLine(
            `${Space8x}const dto = await this.${lowerCaseAggregateName}Mapper.fromEntityToDto(entity);`,
        )
        .writeLine(
            `${Space8x}const trx = options?.trx ?? (await this.${lowerCaseAggregateName}Dao.startTrx());`,
        )
        .writeLine(`${Space8x}try {`)
        .writeLine(`${Space12x}await Promise.all([`)
        .writeLine(`${Space16x}this.${lowerCaseAggregateName}Dao.updateById(dto.id, dto, {`)
        .writeLine(`${Space20x}trx,`)
        .writeLine(`${Space16x}}),`)
        .writeLine(`${Space12x}]);`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.commitTrx(trx);`)
        .writeLine(`${Space12x}entity.dispatchDomainEvents();`)
        .writeLine(`${Space12x}return entity;`)
        .writeLine(`${Space8x}} catch (error) {`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.rollbackTrx(trx);`)
        .writeLine(`${Space12x}throw error;`)
        .writeLine(`${Space8x}}`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    // delete
    writer
        .writeLine(
            `${Space4x}public async delete(entity: I${aggregateClassName}, options?: RepositoryOptions): Promise<I${aggregateClassName}> {`,
        )
        .writeLine(
            `${Space8x}const dto = await this.${lowerCaseAggregateName}Mapper.fromEntityToDto(entity);`,
        )
        .writeLine(
            `${Space8x}const trx = options?.trx ?? (await this.${lowerCaseAggregateName}Dao.startTrx());`,
        )
        .writeLine(`${Space8x}try {`)
        .writeLine(`${Space12x}await this.${lowerCaseAggregateName}Dao.deleteById(dto.id);`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.commitTrx(trx);`)
        .writeLine(`${Space12x}entity.dispatchDomainEvents();`)
        .writeLine(`${Space12x}return entity;`)
        .writeLine(`${Space8x}} catch (error) {`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.rollbackTrx(trx);`)
        .writeLine(`${Space12x}throw error;`)
        .writeLine(`${Space8x}}`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    writer
        .writeLine(`${Space4x}public async getById(id: string, options?: RepositoryOptions) {`)
        .writeLine(
            `${Space8x}const trx = options?.trx ?? (await this.${lowerCaseAggregateName}Dao.startTrx());`,
        )
        .writeLine(`${Space8x}const dto = (await this.${lowerCaseAggregateName}Dao.findOne({`)
        .writeLine(`${Space12x}filter: {`)
        .writeLine(`${Space16x}id: { $eq: id },`)
        .writeLine(`${Space12x}},`)
        .writeLine(`${Space8x}})) as Optional<${aggregateClassName}Dto>;`)
        .writeLine(`${Space8x}if (!dto) throw new ${aggregateClassName}NotFoundError();`)
        .writeLine(`${Space8x}try {`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.commitTrx(trx);`)
        .writeLine(`${Space12x}return this.${lowerCaseAggregateName}Mapper.fromDtoToEntity(dto);`)
        .writeLine(`${Space8x}} catch (error) {`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.rollbackTrx(trx);`)
        .writeLine(`${Space12x}throw error;`)
        .writeLine(`${Space8x}}`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    writer
        .writeLine(`${Space4x}public async getList(input: QueryInput, options?: RepositoryOptions) {`)
        .writeLine(
            `${Space8x}const trx = options?.trx ?? (await this.${lowerCaseAggregateName}Dao.startTrx());`,
        )
        .writeLine(`${Space8x}try {`)
        .writeLine(
            `${Space12x}const listDto = (await this.${lowerCaseAggregateName}Dao.find(input)) as ${aggregateClassName}Dto[];`,
        )
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.commitTrx(trx);`)
        .writeLine(`${Space12x}return this.${lowerCaseAggregateName}Mapper.fromDtosToEntities(listDto);`)
        .writeLine(`${Space8x}} catch (error) {`)
        .writeLine(`${Space12x}if (!options?.trx) await this.${lowerCaseAggregateName}Dao.rollbackTrx(trx);`)
        .writeLine(`${Space12x}throw error;`)
        .writeLine(`${Space8x}}`)
        .writeLine(`${Space4x}}`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.repository.ts`, fileContent);
}
