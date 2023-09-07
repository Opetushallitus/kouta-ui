import { format as formatDate, parseISO } from 'date-fns';
import { TFunction } from 'i18next';
import _ from 'lodash';
import _fp from 'lodash/fp';
import stripTags from 'striptags';
import { match } from 'ts-pattern';

import {
  isEditorState,
  isEmptyEditorState,
} from '#/src/components/LexicalEditorUI/utils';
import {
  ALLOWED_HTML_TAGS,
  EI_TUETUT_KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
  TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
  LANGUAGES,
  NDASH,
  ORGANISAATIOTYYPPI,
} from '#/src/constants';
import { EntityModelBase } from '#/src/types/domainTypes';
import { memoize, memoizeOne } from '#/src/utils/memoize';

import getKoodiNimiTranslation from './getKoodiNimiTranslation';
import { getFirstLanguageValue } from './languageUtils';
import { organisaatioMatchesTyyppi } from './organisaatio/organisaatioMatchesTyyppi';

export const isDev = import.meta.env.MODE === 'development';

export const isProd = import.meta.env.MODE === 'production';

export const isPlaywright = Boolean(localStorage.getItem('isPlaywright'));

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

/* Parsii pilkulla erotetun desimaaliluvun äärelliseksi numeroksi.
Pyöristää annettuun tarkkuuteen (decimals), jos määritelty.
Palautetaan äärellinen numero (muu kuin Inifinity, -Inifnity tai Nan) tai null, jos ei onnistu
 */
export const parseFloatComma = (
  value?: string | number | null,
  decimals?: number
): number | null => {
  if (_.isNumber(value) && _.isFinite(value)) {
    return value;
  } else if (_.isString(value)) {
    const parsedValue = parseFloat(value.replace(',', '.'));
    if (_.isFinite(parsedValue)) {
      return _.isUndefined(decimals)
        ? parsedValue
        : _.round(parsedValue, decimals);
    } else {
      return null;
    }
  } else {
    return null;
  }
};

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

export const getReadableDate = dateData => {
  return formatDateValue(dateData, 'd.M.yyyy') ?? '-';
};

export const getKoutaDateString = (dateData: Date) => {
  if (isValidDate(dateData)) {
    return formatDate(dateData, "yyyy-MM-dd'T'HH:mm");
  }
  return null;
};

export const formatDateValue = (
  date?: Date | string | number,
  format: string = "dd.MM.yyyy' 'HH:mm"
) => {
  try {
    let parsed = date;
    if (_.isString(date)) {
      parsed = parseISO(date);
    }
    if (_.isNumber(date)) {
      parsed = new Date(date);
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
  match(value)
    .when(_.isNil, _.stubFalse)
    .when(
      allFuncs(
        v => _.isArray(v) || _.isString(v),
        v => v.length === 0
      ),
      _.stubFalse
    )
    .when(allFuncs(_.isPlainObject, _.isEmpty), _.stubFalse)
    .when(
      allFuncs(
        _.isPlainObject,
        v => _.has(v, 'value'),
        v => v.value === '' || _.isNil(v.value)
      ),
      _.stubFalse
    )
    .when(allFuncs(isEditorState, isEmptyEditorState), _.stubFalse)
    .otherwise(_.stubTrue);

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
  const numberValue =
    _.isString(value) && value.includes(',')
      ? Number(value.replace(',', '.'))
      : Number(value);
  return _.isNaN(numberValue) ? value : numberValue;
};

export const toSelectValue = value => (_.isNil(value) ? undefined : { value });

export const toSelectValueList = _fp.map((value: string) => ({
  value,
}));

/** Parse a boolean to a string value for selection component.
 * For other than boolean values returns undefined.
 */
export const parseBooleanToString = (value): string | undefined => {
  return _.isBoolean(value) ? String(value) : undefined;
};

/** Parse a string representation of boolean from selection component to boolean.
 * If value is not set, returns undefined.
 */
export const parseStringToBoolean = (value): boolean | undefined => {
  return value === 'true' || value === 'false' ? JSON.parse(value) : undefined;
};

// Returns field name without language part
export const getFieldNameWithoutLanguage = (name: string) =>
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
    const fieldName = getFieldNameWithoutLanguage(name);
    _.set(saveableValues, fieldName!, null);
  });

  // In case of fields from multiple hierarchy levels, we want to process the lowest level one first so we don't accidentally
  // override anything. Sorting the list of registered fields gives eg. yhteyshenkilo before yhteyshenkilo[0].nimi.
  const sortedFields = Object.values(registeredFields)
    .map(f => f.name)
    .sort();

  // Ensure that the fields that are registered (visible) will be saved
  sortedFields.forEach(name => {
    const fieldName = getFieldNameWithoutLanguage(name);
    const fieldValue = _.get(values, fieldName!);

    const valueForSave = isEmptyTranslatedField(fieldValue) ? {} : fieldValue;
    _.set(saveableValues, fieldName!, valueForSave);
  });

  // Some exceptions (fields that should be saved even though they are not visible)
  copyPathsIfDefined(values, saveableValues, [
    'esikatselu',
    'koulutustyyppi',
    'muokkaaja',
    'information.nimi',
    'tarjoajat.tarjoajat',
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

export const valueToArray = v => (_.isNil(v) ? [] : _.castArray(v));

export const safeArrayToValue = a => (_.size(a) > 1 ? a : _.get(a, 0));

const postinumeroUriRegExp = /\d{5}/;
export const getPostinumeroByPostinumeroUri = uri =>
  uri?.match?.(postinumeroUriRegExp)?.[0];

export const formatKoodiLabelWithArvo = (
  koodi: Koodi,
  language: LanguageCode
) => `${getKoodiNimiTranslation(koodi, language)} (${koodi.koodiArvo})`;

export const isIn = (coll: Array<unknown>) => (val: unknown) =>
  coll?.includes(val);

export const getEntityNimiTranslation = (
  entity: EntityModelBase | undefined,
  lng: string
) => {
  const { _enrichedData, nimi } = entity ?? {};
  return getFirstLanguageValue(_enrichedData?.esitysnimi || nimi, lng);
};

export const getKoulutustyyppiTranslationKey = (tyyppi?: string) =>
  _.isNil(tyyppi) ? '' : `koulutustyypit.${_.camelCase(tyyppi)}`;

export const koulutustyyppiHierarkiaToOptions = (hierarkia, t) =>
  hierarkia
    .flatMap(({ value: topValue, children }) => {
      if (children) {
        return children.map(({ value }) => ({
          label:
            ([
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
              KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
              KOULUTUSTYYPPI.TUTKINNON_OSA,
              KOULUTUSTYYPPI.OSAAMISALA,
            ].includes(value)
              ? t(getKoulutustyyppiTranslationKey(topValue)) + ' - '
              : '') + t(getKoulutustyyppiTranslationKey(value)),
          value,
        }));
      } else {
        return [
          {
            label: t(getKoulutustyyppiTranslationKey(topValue)),
            value: topValue,
          },
        ];
      }
    })
    .filter(({ value }) => !EI_TUETUT_KOULUTUSTYYPIT.includes(value));

export const koulutustyyppiHierarkiaToTranslationMap = memoizeOne(
  (hierarkia, t) => {
    const koulutustyyppiOptions = koulutustyyppiHierarkiaToOptions(
      hierarkia,
      t
    );
    return _fp.fromPairs(
      koulutustyyppiOptions.map(({ label, value }) => [value, label])
    );
  }
);

export const getKoulutustyyppiTranslation = (
  koulutustyyppi?: string,
  t?: TFunction
) => {
  const koulutustyyppiMapping = {
    ...koulutustyyppiHierarkiaToTranslationMap(
      TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA,
      t
    ),
    ...koulutustyyppiHierarkiaToTranslationMap(
      TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA,
      t
    ),
  };

  return koulutustyyppi ? koulutustyyppiMapping[koulutustyyppi] : '';
};

export const notToimipisteOrg = org =>
  !organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE, org);

export const toEnumValue = <T extends object>(
  obj: T,
  value?: string | null
) => {
  const values = Object.values(obj);
  const index = values.indexOf(value);
  return values.indexOf(value) >= 0 ? (values[index] as ValueOf<T>) : undefined;
};
