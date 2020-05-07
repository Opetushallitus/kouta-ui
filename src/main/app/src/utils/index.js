import dateFnsformatDate from 'date-fns/format';
import memoizee from 'memoizee';
import _ from 'lodash';
import stripTags from 'striptags';
import { ALLOWED_HTML_TAGS } from '#/src/constants';

export const isDev = process.env.NODE_ENV === 'development';

export const isValidDate = value => _.isDate(value) && !_.isNaN(value);

export const formatDate = dateFnsformatDate;

export const isNumeric = value => {
  if (_.isNumber(value)) {
    return true;
  }

  if (_.isString(value)) {
    return !_.isNaN(parseFloat(value));
  }

  return false;
};

export const getLanguageValue = (value, language = 'fi') =>
  _.isObject(value) ? value[language] || null : null;

export const isFunction = value => typeof value === 'function';

export const getFirstLanguageValue = (value, priorityArg) => {
  const defaultPriority = ['fi', 'en', 'sv'];

  let priority = defaultPriority;

  if (_.isArray(priorityArg)) {
    priority = [...priorityArg, ...defaultPriority];
  }

  if (_.isString(priorityArg)) {
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
  return _.isArray(arr)
    ? arr.reduce((acc, curr) => {
        acc[
          _.isString(curr[languageField])
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
  optional,
) => {
  if (optional && _.isEmpty(obj)) {
    return [];
  }

  if (!_.isObject(obj)) {
    return languages;
  }

  const translationObj = {
    ..._.zipObject(languages),
    ..._.pick(obj, languages),
  };

  const pairs = _.toPairs(translationObj);

  return pairs
    .filter(([, value]) => !validate(value))
    .map(([language]) => language);
};

export const getReadableDateTime = dateData => {
  try {
    return formatDate(dateData, 'd.M.yyyy HH:mm');
  } catch {
    return '-';
  }
};

export const getKoutaDateString = dateData => {
  if (isValidDate(dateData)) {
    return formatDate(dateData, `yyyy-MM-dd'T'HH:mm`);
  }

  if (!_.isObject(dateData)) {
    return null;
  }

  const { year, month, day, hour, minute } = dateData;

  return `${year}-${_.padStart(month, 2, '0')}-${_.padStart(day, 2, '0')}T${
    isNumeric(hour) ? _.padStart(hour, 2, '0') : '00'
  }:${isNumeric(minute) ? _.padStart(minute, 2, '0') : '00'}`;
};

export const formatKoutaDateString = (dateString, format) => {
  if (!_.isString(dateString)) {
    return '';
  }

  const [date, time = ''] = dateString.split('T');
  const [year, month, day] = date.split('-');
  const [hour = '0', minute = '0'] = time.split(':');

  let formattedDate = format;

  formattedDate = formattedDate.replace(/DD/g, _.padStart(day, 2, '0'));
  formattedDate = formattedDate.replace(/MM/g, _.padStart(month, 2, '0'));
  formattedDate = formattedDate.replace(/YYYY/g, year);
  formattedDate = formattedDate.replace(/HH/g, _.padStart(hour, 2, '0'));
  formattedDate = formattedDate.replace(/mm/g, _.padStart(minute, 2, '0'));

  return formattedDate;
};

export const createChainedFunction = (...fns) => (...args) => {
  // eslint-disable-next-line
  for (const fn of fns) {
    if (_.isFunction(fn)) {
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
  return parts.length > 1 ? _.last(parts).toLowerCase() : '';
};

/**
 * Check that given predicate returns truthy for a value or any value in an array
 * Can be used with lodash.cond() to improve readability
 * @param {*} value A single value or an array of values to check
 * @param {*} predicate A function returning truthy for a single matching value
 */
export const ifAny = value => predicate =>
  _.isArray(value) ? value.some(predicate) : predicate(value);

export const otherwise = () => true;

export const sanitizeHTML = html => stripTags(html, ALLOWED_HTML_TAGS);
