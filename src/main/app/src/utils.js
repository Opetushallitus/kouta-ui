import _isDate from 'date-fns/is_date';
import diff from 'fast-array-diff';
import toPairs from 'lodash/toPairs';
import dateAndTime from 'date-and-time';
import zipObject from 'lodash/zipObject';
import pick from 'lodash/pick';
import addHours from 'date-fns/add_hours';
import formatDate from 'date-fns/format';
import _isValidDate from 'date-fns/is_valid';
import mapValues from 'lodash/mapValues';
import produce from 'immer';

export const isString = value => typeof value === 'string';

export const isNumber = value => typeof value === 'number';

export const isDate = value => _isDate(value);

export const isObject = value => toString.call(value) === '[object Object]';

export const isArray = value => toString.call(value) === '[object Array]';

export const isValidDate = value => isDate(value) && _isValidDate(value);

export const getLanguageValue = (value, language = 'fi') =>
  isObject(value) ? value[language] || null : null;

export const isFunction = value => typeof value === 'function';

export const getTreeLevel = ({
  tree,
  level,
  childrenKey = 'children',
  currentLevel = 0,
}) => {
  if (!isObject(tree) || !isArray(tree[childrenKey])) {
    return [];
  }

  if (currentLevel === level) {
    return tree[childrenKey];
  }

  return tree[childrenKey].reduce((acc, curr) => {
    return [
      ...acc,
      ...getTreeLevel({ tree: curr, level, currentLevel: currentLevel + 1 }),
    ];
  }, []);
};

export const arrayDiff = (previous, next) => {
  return diff.diff(previous, next);
};

export const getFirstLanguageValue = (value, priorityArg) => {
  const defaultPriority = ['fi', 'en', 'sv'];

  let priority = defaultPriority;

  if (isArray(priorityArg)) {
    priority = [...priorityArg, ...defaultPriority];
  }

  if (isString(priorityArg)) {
    priority = [priorityArg, ...defaultPriority];
  }

  for (const p of priority) {
    const v = getLanguageValue(value, p);

    if (v) {
      return v;
    }
  }

  return null;
};

export const truncateString = (value, length) => {
  if (!isString(value)) {
    return '';
  }

  const slice = value.slice(0, length);

  return slice.length < length ? `${slice}...` : slice;
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
    return [];
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

export const parseDate = (dateString, dateFormat) => {
  return dateAndTime.parse(dateString, dateFormat);
};

export const toKoutaDateString = date => {
  if (!isValidDate(date)) {
    return null;
  }

  const timezoneOffset = date.getTimezoneOffset() / 60;
  const timezoneDifference = timezoneOffset + 2;
  const fixedDate = addHours(date, timezoneDifference);

  return formatDate(fixedDate, 'YYYY-MM-DD[T]HH:mm');
};

export const getKoodistoNimiAndKoodiUri = koodisto => {
  return isArray(koodisto)
    ? koodisto.map(({ metadata, koodiUri, versio }) => ({
        koodiUri: `${koodiUri}#${versio}`,
        nimi: mapValues(arrayToTranslationObject(metadata), ({ nimi }) => nimi),
      }))
    : [];
};

export const formatDateInFinnishTimeZone = (date, dateFormat) => {
  if (!isValidDate(date)) {
    return null;
  }

  const timezoneOffset = date.getTimezoneOffset() / 60;
  const timezoneDifference = timezoneOffset + 2;
  const fixedDate = addHours(date, timezoneDifference);

  return formatDate(fixedDate, dateFormat);
};

export const updateAll = ({ data, updates, keyField = 'oid' }) => {
  const updateArr = isArray(updates) ? updates : [updates];

  return produce(data, draft => {
    for (const obj of updateArr) {
      if (isObject(obj) && obj[keyField]) {
        draft.byOid[obj[keyField]] = {
          ...(draft.byOid[keyField] || {}),
          ...obj,
        };
      }
    }
  });
};

export const createChainedFunction = (...fns) => (...args) => {
  for (let fn of fns) {
    if (isFunction(fn)) {
      fn(...args);
    }
  }
};
