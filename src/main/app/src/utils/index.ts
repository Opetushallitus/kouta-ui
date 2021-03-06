import { format as formatDate, parseISO } from 'date-fns';
import _ from 'lodash';
import _fp from 'lodash/fp';
import stripTags from 'striptags';

import {
  isEditorState,
  isEmptyEditorState,
} from '#/src/components/Editor/utils';
import { ALLOWED_HTML_TAGS, LANGUAGES, NDASH } from '#/src/constants';
import { memoize } from '#/src/utils/memoize';

import getKoodiNimiTranslation from './getKoodiNimiTranslation';

const { NODE_ENV, REACT_APP_CYPRESS } = process.env;

export const isDev = NODE_ENV === 'development';

export const isNodeEnv = env =>
  (_.isArray(env) ? env : [env]).includes(NODE_ENV);

export const isCypress = Boolean(REACT_APP_CYPRESS);

export const isValidDate = value => _.isDate(value) && !_.isNaN(value);

export const isPartialDate = date => {
  const dateString = _.isDate(date) ? getKoutaDateString(date) : null;
  if (dateString) {
    const [date] = dateString.split('T');
    return date === 'NaN-NaN-NaN';
  } else {
    return false;
  }
};

export const parseFloatComma = (value: string | number) =>
  _.isNumber(value) ? value : parseFloat(value.replace(',', '.'));

export const isNumeric = value => {
  if (_.isNumber(value)) {
    return true;
  }

  if (_.isString(value)) {
    return !_.isNaN(parseFloat(value.replace(',', '.')));
  }

  return false;
};

export const getReadableDateTime = dateData => {
  return formatDateValue(dateData, "d.M.yyyy' 'HH:mm") ?? '-';
};

export const getKoutaDateString = (dateData: Date) => {
  if (isValidDate(dateData)) {
    return formatDate(dateData, "yyyy-MM-dd'T'HH:mm");
  }
  return null;
};

export const formatDateValue = (
  date?: Date | string,
  format: string = "dd.MM.yyyy' 'HH:mm"
) => {
  try {
    let parsed = date;
    if (_.isString(date)) {
      parsed = parseISO(date);
    }
    if (isValidDate(parsed)) {
      return formatDate(parsed as Date, format);
    }
  } catch (e) {}
  return null;
};

export const formatDateRange = (
  start: Date | string,
  end?: Date | string,
  dateFormat?: string
) =>
  `${formatDateValue(start, dateFormat) ?? ''} ${NDASH} ${
    formatDateValue(end, dateFormat) ?? ''
  }`;

export const createChainedFunction =
  (...fns) =>
  (...args) => {
    // eslint-disable-next-line
  for (const fn of fns) {
      if (_.isFunction(fn)) {
        fn(...args);
      }
    }
  };

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

export const getFileExtension = (file: File) => {
  const parts = file.name.split('.');
  return parts.length > 1 ? _.toLower(_.last(parts) as string) : '';
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

export const parseKeyVal = memoize(
  _fp.flow(
    _fp.split(';'),
    _fp.map(keyVal => _fp.trim(keyVal).split('=')),
    _fp.fromPairs
  )
);

export const getCookie = name => _.get(parseKeyVal(document.cookie), name);

const allFuncs =
  (...fns) =>
  value =>
    _.every(fns, fn => fn(value));

export const formValueExists = value =>
  _.cond([
    [_.isNil, _.stubFalse],
    [
      allFuncs(
        v => _.isArray(v) || _.isString(v),
        v => v.length === 0
      ),
      _.stubFalse,
    ],
    [allFuncs(_.isPlainObject, _.isEmpty), _.stubFalse],
    [
      allFuncs(
        _.isPlainObject,
        v => _.has(v, 'value'),
        v => v.value === '' || _.isNil(v.value)
      ),
      _.stubFalse,
    ],
    [allFuncs(isEditorState, isEmptyEditorState), _.stubFalse],
    [otherwise, _.stubTrue],
  ])(value);

export const isDeepEmptyFormValues = value =>
  !formValueExists(value) ||
  (_.isObjectLike(value) && _.every(value, isDeepEmptyFormValues));

export const assert = console.assert;

export const oneAndOnlyOne = all => all && all.length === 1 && all[0];

/** Tries to parse a (form) value to a number.
 * For empty values (null, undefined or empty string) returns null and when conversion to number fails, returns the given value.
 * This way we can pass a number representation to backend when needed, and give null when the value should be removed,
 * but fall back to original value when conversion fails, which is less confusing when debugging.
 */
export const maybeParseNumber = value => {
  if (_.isNil(value) || value === '') {
    return null;
  }
  const numberValue = Number(value);
  return _.isNaN(numberValue) ? value : numberValue;
};

export const toSelectValue = value => (_.isNil(value) ? undefined : { value });

export const toSelectValueList = _fp.map((value: string) => ({
  value,
}));

// Returns field name without language part
export const getFieldName = (name: string) =>
  name.match(`^(.+?)(\\.(${LANGUAGES.join('|')}))?$`)?.[1];

const isEmptyTranslatedField = value =>
  _.isObject(value) &&
  !_.isEmpty(_.intersection(_.keys(value), LANGUAGES)) &&
  _.every(value, v => !formValueExists(v));

const copyPathsIfDefined = (source, target, paths) => {
  _.forEach(paths, path => {
    const val = _.get(source, path);
    if (!_.isUndefined(val)) {
      _.set(target, path, val);
    }
  });
};

// Get form values for saving. Filters out fields that user has hidden.
// Result can be passed to get**ByFormValues().
// Note that this does not filter out fields that are already in initialValues but are hidden.
// This means that in edit-mode values that come from backend will only be filtered out if
// the user somehow makes those fields visible and then hides them again by changing form values.
export const getValuesForSaving = (
  values: any,
  registeredFields: Record<string, { name: string }>,
  unregisteredFields: Record<string, { name: string }>,
  initialValues: any = {}
) => {
  // Use initial values as a base. Both create and edit forms' changes are differences to the initial values.
  const saveableValues: any = _.cloneDeep(initialValues);

  // Ensure that all fields that were unregistered (hidden by the user) are sent to backend as empty values
  _.forEach(unregisteredFields, ({ name }) => {
    const fieldName = getFieldName(name);
    _.set(saveableValues, fieldName, null);
  });

  // Ensure that the fields that are registered (visible) will be saved
  _.forEach(registeredFields, ({ name }) => {
    const fieldName = getFieldName(name);
    const fieldValue = _.get(values, fieldName);

    const valueForSave = isEmptyTranslatedField(fieldValue) ? {} : fieldValue;
    _.set(saveableValues, fieldName, valueForSave);
  });

  // Some exceptions (fields that should be saved even though they are not visible)
  // TODO: There might be a few other exceptions. Check before using in other forms and add here.
  copyPathsIfDefined(values, saveableValues, [
    'esikatselu',
    'koulutustyyppi',
    'muokkaaja',
    'information.nimi',
  ]);

  return saveableValues;
};

export const retryOnRedirect = async ({ httpClient, targetUrl }) => {
  const fn = () =>
    httpClient.get(targetUrl, {
      cache: {
        ignoreCache: true,
      },
    });
  let res = await fn();
  let count = 3;

  while (res?.request?.responseURL !== targetUrl && count !== 0) {
    res = await fn();
    count -= 1;
  }

  // TODO: If still trying to redirect, then return 401

  return res?.data;
};

export const safeArray = v => (_.isNil(v) ? [] : _.castArray(v));

export const safeArrayToValue = a => (_.size(a) > 1 ? a : _.get(a, 0));

const postinumeroUriRegExp = /\d{5}/;
export const getPostinumeroByPostinumeroUri = uri =>
  uri?.match?.(postinumeroUriRegExp)?.[0];

export const formatKoodiLabelWithArvo = (koodi, language) =>
  `${getKoodiNimiTranslation(koodi, language)} (${koodi.koodiArvo})`;
