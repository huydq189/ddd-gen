import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../../utils/create-folder-if-not-exists';
import { Space4x, Space8x, capitalizeFirstLetter, createClassName } from '../../../../utils/string';
export function createAggregateTableFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/infra/databases/daos`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { BaseDao, IBaseDao, IQueryUtil } from '@cbidigital/aqua';`)
        .writeLine(
            `import { Dao, DatabaseLookup, Inject, Logger, ModuleDatabase, Scope } from '@heronjs/common';`,
        )
        .writeLine(`import { KnexClient } from '@heronjs/core';`)
        .writeLine(`import { InjectTokens, TableNames } from '../../../../../constants';`)
        .writeLine(
            `import { ${aggregateClassName}CodeAlreadyExistError, ${aggregateClassName}DTO } from '../../../domain';`,
        )
        .writeLine(`import { ${capitalizeFirstLetter(domainName)}Constraints } from '../consts';`);

    writer
        .writeLine(`export type I${aggregateClassName}DAO = IBaseDao<${aggregateClassName}DTO>;`)
        .blankLine();

    writer
        .writeLine(`@Dao({ token: InjectTokens.Dao.${upperCaseAggregateName}, scope: Scope.SINGLETON })`)
        .writeLine(
            `export class ${aggregateClassName}DAO extends BaseDao<${aggregateClassName}DTO> implements I${aggregateClassName}DAO {`,
        )
        .writeLine(`${Space4x}constructor(`)
        .writeLine(`${Space8x}@DatabaseLookup() db: ModuleDatabase<KnexClient>,`)
        .writeLine(
            `${Space8x}@Inject(InjectTokens.Common.${domainName.toUpperCase()}_QUERY_UTIL) queryUtil: IQueryUtil<${aggregateClassName}DTO>,`,
        )
        .writeLine(`${Space4x}) {`)
        .writeLine(`${Space8x}super({ db, queryUtil, tableName: TableNames.${upperCaseAggregateName} });`)
        .writeLine(`${Space4x}}`)
        .blankLine();

    writer
        .writeLine(`${Space4x}protected _transformError(err: any) {`)
        .writeLine(`${Space8x}const logger = new Logger(this.constructor.name);`)
        .writeLine(`${Space8x}logger.error(err);`)
        .writeLine(`${Space8x}return err;`)
        .writeLine(`${Space4x}}`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.dao.ts`, fileContent);
}
