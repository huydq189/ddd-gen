import { TypeEnum } from './type-of';

const string = `.string().trim().nonempty()`;
const number = `.number()`;
const boolean = `.boolean()`;
const date = `.coerce.date()`;
const uuid = `.string().uuid()`;
const nullable = `.nullable()`;
const array = `.array()`;
const optional = `.optional()`;

export const generateZodSchemaLine = (
    type: string,
    options: { uuid?: boolean; nullable?: boolean; optional?: boolean; array?: boolean },
) => {
    let zodSchemaLine = '';
    switch (type) {
        case TypeEnum.boolean:
            zodSchemaLine = `z${boolean}`;
            break;
        case TypeEnum.number:
            zodSchemaLine = `z${number}`;
            break;
        case TypeEnum.date:
            zodSchemaLine = `z${date}`;
            break;
        case TypeEnum.string:
            zodSchemaLine = `z${string}`;
            break;
        default:
            throw Error('Not implement');
    }
    if (options.uuid && !zodSchemaLine.includes('uuid()')) zodSchemaLine += uuid;
    if (options.array && !zodSchemaLine.includes('array()')) zodSchemaLine += array;
    if (options.nullable && !zodSchemaLine.includes('nullable()')) zodSchemaLine += nullable;
    if (options.optional && !zodSchemaLine.includes('optional()')) zodSchemaLine += optional;
    return zodSchemaLine + ',';
};
