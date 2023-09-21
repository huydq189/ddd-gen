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
            `import { Dao, DataSource, Inject, Lifecycle, Logger, ModuleDataSource } from '@heronjs/common';`,
        )
        .writeLine(`import { KnexClient } from '@heronjs/core';`)
        .writeLine(
            `import { ${upperCaseAggregateName}_INJECT_TOKENS, ${upperCaseAggregateName}_TABLE_NAMES } from '../../../../../constants';`,
        )
        .writeLine(`import { ${aggregateClassName}Dto } from '../../../domain';`);

    writer
        .writeLine(`export type I${aggregateClassName}Dao = IBaseDao<${aggregateClassName}Dto>;`)
        .blankLine();

    writer
        .writeLine(
            `@Dao({ token: ${upperCaseAggregateName}_INJECT_TOKENS.DAO.${upperCaseAggregateName}, scope: Lifecycle.Singleton })`,
        )
        .writeLine(
            `export class ${aggregateClassName}Dao extends BaseDao<${aggregateClassName}Dto> implements I${aggregateClassName}Dao {`,
        )
        .writeLine(`${Space4x}constructor(`)
        .writeLine(`${Space8x}@DataSource() db: ModuleDataSource<KnexClient>,`)
        .writeLine(
            `${Space8x}@Inject(${upperCaseAggregateName}_INJECT_TOKENS.QUERY_UTIL) queryUtil: IQueryUtil<${aggregateClassName}Dto>,`,
        )
        .writeLine(`${Space4x}) {`)
        .writeLine(
            `${Space8x}super({ db, queryUtil, tableName: ${upperCaseAggregateName}_TABLE_NAMES.${upperCaseAggregateName} });`,
        )
        .writeLine(`${Space4x}}`)
        .blankLine();

    writer
        .writeLine(`${Space4x}protected transformError(err: any) {`)
        .writeLine(`${Space8x}const logger = new Logger(this.constructor.name);`)
        .writeLine(`${Space8x}logger.error(err);`)
        .writeLine(`${Space8x}return err;`)
        .writeLine(`${Space4x}}`);

    writer.writeLine(`}`);

    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.dao.ts`, fileContent);
}
