import _isDate from 'date-fns/is_date';

export const isString = value => typeof value === 'string';

export const isNumber = value => typeof value === 'number';

export const isDate = value => _isDate(value);

export const isObject = value => toString.call(value) === '[object Object]';

export const isArray = value => toString.call(value) === '[object Array]';

export const getLanguageValue = (value, language = 'fi') =>
  isObject(value) ? value[language] || value['fi'] || null : null;

export const isFunction = value => typeof value === 'function';
