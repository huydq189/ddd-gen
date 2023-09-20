import * as mod from 'code-block-writer';
import fs from 'fs';
import { createFolderIfNotExists } from '../../../utils/create-folder-if-not-exists';
import {
    Space12x,
    Space16x,
    Space20x,
    Space24x,
    Space4x,
    Space8x,
    createClassName,
} from '../../../utils/string';
export function createAggregateBuilderFile(input: any) {
    const { aggregateName, domainName, properties } = input;
    const lowerCaseAggregateName = aggregateName.toLowerCase();
    const upperCaseAggregateName = aggregateName.toUpperCase();
    const aggregateClassName = createClassName(aggregateName);

    /****************************************** CREATE FOLDER ******************************************/
    const aggregateFolder = `src/features/${domainName.toLowerCase()}/domain/builders`;
    createFolderIfNotExists(aggregateFolder);

    /****************************************** FILE CONTENT ******************************************/
    const writer = new mod.default({
        // optional options
        useTabs: false, // default: false
        useSingleQuote: true, // default: false
    });

    writer
        .writeLine(`import { DomainEvent, IEntityBuilder, IDomainEventHandler } from '@cbidigital/aqua';`)
        .writeLine(`import { Inject, Provider, Lifecycle } from '@heronjs/common';`)
        .writeLine(`import { InjectTokens } from '../../../../constants';`)
        .writeLine(`import { I${aggregateClassName}DAO } from '../../infra';`)
        .writeLine(
            `import { I${aggregateClassName}, ${aggregateClassName}, ${aggregateClassName}Props } from '../aggregates';`,
        );

    writer
        .writeLine(`export type ${aggregateClassName}BuilderBuildPayload = {`)
        .writeLine(`${Space4x}id?: string;`)
        .writeLine(`${Space4x}props?: ${aggregateClassName}Props;`)
        .writeLine(`${Space4x}externalProps?: Record<string, any>;`)
        .writeLine(`};`);
    writer
        .writeLine(
            `export type I${aggregateClassName}Builder = IEntityBuilder<I${aggregateClassName}, ${aggregateClassName}BuilderBuildPayload>;`,
        )
        .blankLine();

    writer
        .writeLine(
            `@Provider({ token: InjectTokens.Builder.${upperCaseAggregateName}, scope: Lifecycle.Singleton })`,
        )
        .writeLine(`export class ${aggregateClassName}Builder implements I${aggregateClassName}Builder {`)
        .writeLine(`${Space4x}constructor(`)
        .writeLine(`${Space8x}@Inject(InjectTokens.EventHandler.${upperCaseAggregateName})`)
        .writeLine(
            `${Space8x}protected readonly eventHandler: IDomainEventHandler<DomainEvent<${aggregateClassName}Props>>,`,
        )
        .writeLine(
            `${Space8x}@Inject(InjectTokens.Dao.${upperCaseAggregateName}) protected readonly dao: I${aggregateClassName}DAO,`,
        )
        .writeLine(`${Space4x}) {}`)
        .blankLine();

    // build
    writer
        .writeLine(
            `${Space4x}async build({ id, props, externalProps }: ${aggregateClassName}BuilderBuildPayload = {}): Promise<I${aggregateClassName}> {`,
        )
        .writeLine(`${Space8x}return new ${aggregateClassName}({`)
        .writeLine(`${Space12x}id,`)
        .writeLine(`${Space12x}props,`)
        .writeLine(`${Space12x}eventEmitter: this.eventHandler,`)
        .writeLine(`${Space12x}externalProps,`)
        .writeLine(`${Space8x}});`);
    writer.writeLine(`${Space4x}}`);

    // buildList

    writer
        .writeLine(
            `${Space4x}async buildList(payload: ${aggregateClassName}BuilderBuildPayload[] | number): Promise<I${aggregateClassName}[]> {`,
        )
        .writeLine(`${Space8x}if (typeof payload === 'number') {`)
        .writeLine(`${Space12x}return Array.from(`)
        .writeLine(`${Space16x}{ length: payload },`)
        .writeLine(`${Space16x}() =>`)
        .writeLine(`${Space20x}new ${aggregateClassName}({`)
        .writeLine(`${Space24x}eventEmitter: this.eventHandler,`)
        .writeLine(`${Space20x}}),`)
        .writeLine(`${Space12x});`)
        .writeLine(`${Space8x}}`)
        .writeLine(`${Space8x}return payload.map(`)
        .writeLine(`${Space12x}({ id, props, externalProps }) =>`)
        .writeLine(`${Space16x}new ${aggregateClassName}({`)
        .writeLine(`${Space20x}id,`)
        .writeLine(`${Space20x}props,`)
        .writeLine(`${Space20x}eventEmitter: this.eventHandler,`)
        .writeLine(`${Space20x}externalProps,`)
        .writeLine(`${Space16x}}),`)
        .writeLine(`${Space8x});`)
        .writeLine(`${Space4x}}`);

    writer.writeLine(`}`);
    /****************************************** WRITE FILE TO DISK ******************************************/
    const fileContent = writer.toString();
    fs.writeFileSync(`${aggregateFolder}/${lowerCaseAggregateName}.builder.ts`, fileContent);
}
