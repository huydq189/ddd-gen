export enum TypeEnum {
    string = 'string',
    number = 'number',
    date = 'Date',
    boolean = 'boolean',
}
export function getType(input: string) {
    const nullable = input.includes('Nullable');
    const optional = input.includes('Optional');
    const array = input.includes('[]');

    let type = 'string';
    const isString = input.includes('string');
    if (isString) type = 'string';
    const isNumber = input.includes('number');
    if (isNumber) type = 'number';
    const isDate = input.includes('Date');
    if (isDate) type = 'Date';
    const isBoolean = input.includes('boolean');
    if (isBoolean) type = 'boolean';

    return {
        nullable,
        optional,
        array,
        type,
    };
}
