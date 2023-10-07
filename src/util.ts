export const isString = (v:unknown): v is string => typeof v === 'string';

export const isEmptyString = (v:unknown): v is string => isString(v) && v !== '';

export const isArray = Array.isArray;

export const isEmptyArray = (v:unknown): v is Array<any> => isArray(v) && v.length === 0;

export const hasOwn = (object: object, key: string | symbol) => Object.prototype.hasOwnProperty.call(object, key);