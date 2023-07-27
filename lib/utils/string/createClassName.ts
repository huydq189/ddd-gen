import { camelize } from './utils';

export function createClassName(aggregateName: string) {
    const camelCaseString = camelize(aggregateName);
    const className = camelCaseString[0].toUpperCase() + camelCaseString.substring(1, camelCaseString.length);
    return className;
}
