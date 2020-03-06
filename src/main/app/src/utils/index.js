import dateFnsformatDate from 'date-fns/format';
import memoizee from 'memoizee';
import {
  last,
  padStart,
  pick,
  toPairs,
  zipObject,
  isDate,
  isNumber,
  isString,
  isObject,
  isArray,
} from 'lodash';
import { useMachine as useXstateMachine } from '@xstate/react';

export const isDev = process.env.NODE_ENV === 'development';

export const isValidDate = value => isDate(value) && !isNaN(value);

export const formatDate = dateFnsformatDate;

export const isNumeric = value => {
  if (isNumber(value)) {
    return true;
  }

  if (isString(value)) {
    return !isNaN(parseFloat(value));
  }

  return false;
};

export const getLanguageValue = (value, language = 'fi') =>
  isObject(value) ? value[language] || null : null;

export const isFunction = value => typeof value === 'function';

export const getFirstLanguageValue = (value, priorityArg) => {
  const defaultPriority = ['fi', 'en', 'sv'];

  let priority = defaultPriority;

  if (isArray(priorityArg)) {
    priority = [...priorityArg, ...defaultPriority];
  }

  if (isString(priorityArg)) {
    priority = [priorityArg, ...defaultPriority];
  }

  // eslint-disable-next-line
  for (const p of priority) {
    const v = getLanguageValue(value, p);

    if (v) {
      return v;
    }
  }

  return null;
};

export const arrayToTranslationObject = (arr, languageField = 'kieli') => {
  return isArray(arr)
    ? arr.reduce((acc, curr) => {
        acc[
          isString(curr[languageField])
            ? curr[languageField].toLowerCase()
            : '_'
        ] = curr;

        return acc;
      }, {})
    : {};
};

export const getInvalidTranslations = (
  obj,
  languages = [],
  validate = v => !!v,
) => {
  if (!isObject(obj)) {
    return languages;
  }

  const translationObj = {
    ...zipObject(languages),
    ...pick(obj, languages),
  };

  const pairs = toPairs(translationObj);

  return pairs
    .filter(([, value]) => !validate(value))
    .map(([language]) => language);
};

export const getKoutaDateString = dateData => {
  if (isValidDate(dateData)) {
    return formatDate(dateData, `yyyy-MM-dd'T'HH:mm`);
  }

  if (!isObject(dateData)) {
    return null;
  }

  const { year, month, day, hour, minute } = dateData;

  return `${year}-${padStart(month, 2, '0')}-${padStart(day, 2, '0')}T${
    isNumeric(hour) ? padStart(hour, 2, '0') : '00'
  }:${isNumeric(minute) ? padStart(minute, 2, '0') : '00'}`;
};

export const formatKoutaDateString = (dateString, format) => {
  if (!isString(dateString)) {
    return '';
  }

  const [date, time = ''] = dateString.split('T');
  const [year, month, day] = date.split('-');
  const [hour = '0', minute = '0'] = time.split(':');

  let formattedDate = format;

  formattedDate = formattedDate.replace(/DD/g, padStart(day, 2, '0'));
  formattedDate = formattedDate.replace(/MM/g, padStart(month, 2, '0'));
  formattedDate = formattedDate.replace(/YYYY/g, year);
  formattedDate = formattedDate.replace(/HH/g, padStart(hour, 2, '0'));
  formattedDate = formattedDate.replace(/mm/g, padStart(minute, 2, '0'));

  return formattedDate;
};

export const createChainedFunction = (...fns) => (...args) => {
  // eslint-disable-next-line
  for (const fn of fns) {
    if (isFunction(fn)) {
      fn(...args);
    }
  }
};

export const memoize = (fn, opts = {}) => memoizee(fn, { max: 100, ...opts });

export const memoizePromise = (fn, opts = {}) =>
  memoize(fn, { promise: true, ...opts });

export const getTestIdProps = testId => ({
  'data-testid': testId,
});

export const getImageFileDimensions = imgFile => {
  const objectURL = URL.createObjectURL(imgFile);
  const img = new Image();
  img.src = objectURL;
  const result = new Promise((resolve, reject) => {
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = e => reject(e);
  });
  result.finally(() => URL.revokeObjectURL(objectURL));
  return result;
};

export const getFileExtension = file => {
  const parts = file.name.split('.');
  return parts.length > 1 ? last(parts).toLowerCase() : '';
};

export const useMachine = (machine, options) =>
  useXstateMachine(machine, {
    devTools: isDev,
    ...options,
  });

/**
 * Check that given predicate returns truthy for a value or any value in an array
 * Can be used with lodash.cond() to improve readability
 * @param {*} value A single value or an array of values to check
 * @param {*} predicate A function returning truthy for a single matching value
 */
export const ifAny = value => predicate =>
  isArray(value) ? value.some(predicate) : predicate(value);

export const otherwise = () => true;
