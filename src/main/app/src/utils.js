import _isDate from 'date-fns/is_date';

export const isString = value => typeof value === 'string';

export const isNumber = value => typeof value === 'number';

export const isDate = value => _isDate(value);
