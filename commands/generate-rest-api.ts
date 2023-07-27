import {
    createAggregateBuilderFile,
    createAggregateBuilderIndexFile,
    createAggregateCodeAlreadyExistErrorFile,
    createAggregateCountListUseCaseFile,
    createAggregateCountListUseCaseTypeFile,
    createAggregateCreateInputFile,
    createAggregateCreateUseCaseFile,
    createAggregateCreateUseCaseTypeFile,
    createAggregateDAOFile,
    createAggregateDAOIndexFile,
    createAggregateDTOFile,
    createAggregateDTOIndexFile,
    createAggregateDeleteInputFile,
    createAggregateDeleteUseCaseFile,
    createAggregateDeleteUseCaseTypeFile,
    createAggregateErrorCodesConstFile,
    createAggregateEventNamesConstFile,
    createAggregateFile,
    createAggregateGetByIdUseCaseFile,
    createAggregateGetByIdUseCaseTypeFile,
    createAggregateGetListUseCaseFile,
    createAggregateGetListUseCaseTypeFile,
    createAggregateIndexConstFile,
    createAggregateIndexErrorFile,
    createAggregateIndexTypeFile,
    createAggregateMapperFile,
    createAggregateMapperIndexFile,
    createAggregateNotFoundErrorFile,
    createAggregatePresentationFile,
    createAggregateRepositoryFile,
    createAggregateRepositoryIndexFile,
    createAggregateTableFile,
    createAggregateTableIndexFile,
    createAggregateUpdateInputFile,
    createAggregateUpdateUseCaseFile,
    createAggregateUpdateUseCaseTypeFile,
    createAggregateUseCaseCommandIndexFile,
    createAggregateUseCaseCommandTypeIndexFile,
    createAggregateUseCaseQueryIndexFile,
    createAggregateUseCaseQueryTypeIndexFile,
} from '../lib/code-writer';
import { preprocessing, readExcelFile } from '../lib/utils/excel';

export const generateRestAPI = function (path: string, options: any) {
    const data = readExcelFile(path);
    const { aggregateName, properties } = preprocessing(data);
    const domainName = options?.domainName ?? aggregateName;
    console.log(domainName);
    const input = {
        aggregateName,
        domainName,
        properties,
    };
    // src/features/<domain-name>
    // ├── domain/aggregates/<aggregate-name>
    // │   └── consts
    // │         ├── error-codes.const.ts
    // │         ├── event-names.const.ts
    // │         └── index.ts
    createAggregateEventNamesConstFile(input);
    createAggregateErrorCodesConstFile(input);
    createAggregateIndexConstFile(input);
    // │   └── errors
    // │         └── index.ts
    // │         └── not-found.error.ts
    // |         └── code-already-exist.error.ts
    createAggregateCodeAlreadyExistErrorFile(input);
    createAggregateNotFoundErrorFile(input);
    createAggregateIndexErrorFile(input);
    // │   └── types
    // │         └── index.ts
    // │         └── aggregate-create.types
    // |         └── aggregate-delete.types
    // |         └── aggregate-update.types
    createAggregateCreateInputFile(input);
    createAggregateUpdateInputFile(input);
    createAggregateDeleteInputFile(input);
    createAggregateIndexTypeFile(input);
    // │   └── <aggregate-name>.ts
    createAggregateFile(input);
    // ├── domain
    // │   └── builders
    // │         ├── <aggregate-name>.dto.ts
    // │         └── index.ts
    createAggregateBuilderFile(input);
    createAggregateBuilderIndexFile(input);
    // ├── domain
    // │   └── dtos
    // │         ├── <aggregate-name>.dto.ts
    // │         └── index.ts
    createAggregateDTOFile(input);
    createAggregateDTOIndexFile(input);
    // ├── domain
    // │   └── mappers
    // │         ├── <aggregate-name>.mapper.ts
    // │         └── index.ts
    createAggregateMapperFile(input);
    createAggregateMapperIndexFile(input);
    // ├── domain
    // │   └── repositories
    // │         ├── <aggregate-name>.repository.ts
    // │         └── index.ts
    createAggregateRepositoryFile(input);
    createAggregateRepositoryIndexFile(input);
    // ├── infra/database
    // │   └── tables
    // │         ├── <aggregate-name>.table.ts
    // │         └── index.ts
    createAggregateTableFile(input);
    createAggregateTableIndexFile(input);
    // ├── infra/database
    // │   └── daos
    // │         ├── <aggregate-name>.dao.ts
    // │         └── index.ts
    createAggregateDAOFile(input);
    createAggregateDAOIndexFile(input);
    // ├── app/usecases/<aggregate-name>
    // │   └── index.ts
    // │   └── command
    // │         ├── types
    // │         │     ├── create-<aggregate-name>.types.ts
    // │         │     ├── update<aggregate-name>.types.ts
    // │         │     ├── delete-<aggregate-name>.types.ts
    // │         │     └── index.ts
    // │         ├── create-<aggregate-name>.usecase.ts
    // │         ├── update-<aggregate-name>.usecase.ts
    // │         ├── delete-<aggregate-name>.usecase.ts
    // │         ├── soft-delete-<aggregate-name>.usecase.ts
    // │         └── index.ts
    createAggregateCreateUseCaseTypeFile(input);
    createAggregateUpdateUseCaseTypeFile(input);
    createAggregateDeleteUseCaseTypeFile(input);
    createAggregateUseCaseCommandTypeIndexFile(input);
    createAggregateCreateUseCaseFile(input);
    createAggregateUpdateUseCaseFile(input);
    createAggregateDeleteUseCaseFile(input);
    createAggregateUseCaseCommandIndexFile(input);
    // │   └── query
    // │         ├── types
    // │         │     ├── get-list-<aggregate-name>.types.ts
    // │         │     ├── count-list-<aggregate-name>.types.ts
    // │         │     ├── get-<aggregate-name>-by-id.types.ts
    // │         │     └── index.ts
    // │         ├── get-list-<aggregate-name>.usecase.ts
    // │         ├── count-list-<aggregate-name>.usecase.ts
    // │         ├── get-<aggregate-name>-by-id.usecase.ts
    // │         └── index.ts
    createAggregateGetListUseCaseTypeFile(input);
    createAggregateGetByIdUseCaseTypeFile(input);
    createAggregateCountListUseCaseTypeFile(input);
    createAggregateUseCaseQueryTypeIndexFile(input);
    createAggregateGetByIdUseCaseFile(input);
    createAggregateCountListUseCaseFile(input);
    createAggregateGetListUseCaseFile(input);
    createAggregateUseCaseQueryIndexFile(input);
    // │   └── presentation/controllers/rest/domain-name/admin
    // │         └── aggregate.admin.rest.ts
    createAggregatePresentationFile(input);
};
