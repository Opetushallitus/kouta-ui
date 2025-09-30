import { format as formatDate, isValid, parseISO } from 'date-fns';
import { TFunction } from 'i18next';
import {
  flow,
  flatMap,
  toPairs,
  isDate,
  isNil,
  isString,
  isBoolean,
  isObject,
  isEmpty,
  intersection,
  keys,
  every,
  fromPairs,
  isNumber,
  isUndefined,
  round,
  toLower,
  last,
  stubFalse,
  isPlainObject,
  isObjectLike,
  stubTrue,
  has,
  forEach,
  get,
  set,
  cloneDeep,
  size,
  camelCase,
  castArray,
} from 'lodash';
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
import { SelectValue } from '#/src/types/formTypes';
import { memoizeOne } from '#/src/utils/memoize';

import getKoodiNimiTranslation from './getKoodiNimiTranslation';
import { getFirstLanguageValue } from './languageUtils';
import { organisaatioMatchesTyyppi } from './organisaatio/organisaatioMatchesTyyppi';

export const isDev = import.meta.env.MODE === 'development';

export const isProd = import.meta.env.MODE === 'production';

export const isPlaywright = Boolean(localStorage.getItem('isPlaywright'));

export const isValidDate = isValid;

export const isPartialDate = date => {
  const dateString = isDate(date) ? getKoutaDateString(date) : null;
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
  if (isNumber(value) && isFinite(value)) {
    return value;
  } else if (isString(value)) {
    const parsedValue = parseFloat(value.replace(',', '.'));
    if (isFinite(parsedValue)) {
      return isUndefined(decimals) ? parsedValue : round(parsedValue, decimals);
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const isNumeric = value => {
  if (isNumber(value)) {
    return true;
  }

  if (isString(value)) {
    return !isNaN(parseFloat(value.replace(',', '.')));
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
  date?: Date | string | number | null,
  format: string = "dd.MM.yyyy' 'HH:mm"
) => {
  try {
    let parsed = date;
    if (isString(date)) {
      parsed = parseISO(date);
    }
    if (isNumber(date)) {
      parsed = new Date(date);
    }
    if (isValidDate(parsed)) {
      return formatDate(parsed as Date, format);
    }
  } catch {}
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

export const getTestIdProps = testId => ({
  'data-test-id': testId,
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
  return parts.length > 1 ? toLower(last(parts) as string) : '';
};

export const sanitizeHTML = html => stripTags(html, ALLOWED_HTML_TAGS);

export function getCookies() {
  return Object.fromEntries(
    document.cookie
      .split('; ')
      .filter(Boolean)
      .map(cookieStr => {
        const [key, ...rest] = cookieStr.split('=');
        return [decodeURIComponent(key), decodeURIComponent(rest.join('='))];
      })
  );
}

export const getCookie = (name: string) => getCookies()[name];

const allFuncs =
  (...fns) =>
  value =>
    every(fns, fn => fn(value));

export const formValueExists = value =>
  match(value)
    .when(isNil, stubFalse)
    .when(
      allFuncs(
        v => Array.isArray(v) || isString(v),
        v => v.length === 0
      ),
      stubFalse
    )
    .when(allFuncs(isPlainObject, isEmpty), stubFalse)
    .when(
      allFuncs(
        isPlainObject,
        v => has(v, 'value'),
        v => v.value === '' || isNil(v.value)
      ),
      stubFalse
    )
    .when(allFuncs(isEditorState, isEmptyEditorState), stubFalse)
    .otherwise(stubTrue);

export const isDeepEmptyFormValues = value =>
  !formValueExists(value) ||
  (isObjectLike(value) && every(value, isDeepEmptyFormValues));

export const assert = console.assert;

export const oneAndOnlyOne = all => all && all.length === 1 && all[0];

/** Tries to parse a (form) value to a number.
 * For empty values (null, undefined or empty string) returns null and when conversion to number fails, returns the given value.
 * This way we can pass a number representation to backend when needed, and give null when the value should be removed,
 * but fall back to original value when conversion fails, which is less confusing when debugging.
 */
export const maybeParseNumber = value => {
  if (isNil(value) || value === '') {
    return null;
  }
  const numberValue =
    isString(value) && value.includes(',')
      ? Number(value.replace(',', '.'))
      : Number(value);
  return isNaN(numberValue) ? value : numberValue;
};

export const toSelectValue = value => (isNil(value) ? undefined : { value });

export const toSelectValueList = (list?: Array<string>) =>
  list?.map(value => ({ value }));

export const toKielistettyWithValueField = (
  obj: TranslatedField | undefined
) => {
  return Object.entries(obj || {}).reduce((result, [lang, val]) => {
    return { ...result, [lang]: { value: val } };
  }, {});
};

export const toKielistettyWithValueStr = (
  obj: Record<LanguageCode, SelectValue>
) => {
  return Object.entries(obj || {}).reduce((result, [key, val]) => {
    return key && val?.value ? { ...result, [key]: val.value } : result;
  }, {});
};

/** Parse a boolean to a string value for selection component.
 * For other than boolean values returns undefined.
 */
export const parseBooleanToString = (value): string | undefined => {
  return isBoolean(value) ? String(value) : undefined;
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
  isObject(value) &&
  !isEmpty(intersection(keys(value), LANGUAGES)) &&
  every(value, v => !formValueExists(v));

const copyPathsIfDefined = (source, target, paths) => {
  forEach(paths, path => {
    const val = get(source, path);
    if (!isUndefined(val)) {
      set(target, path, val);
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
  const saveableValues: any = cloneDeep(initialValues);

  // Ensure that all fields that were unregistered (hidden by the user) are sent to backend as empty values
  forEach(unregisteredFields, ({ name }) => {
    const fieldName = getFieldNameWithoutLanguage(name);
    set(saveableValues, fieldName!, null);
  });

  // In case of fields from multiple hierarchy levels, we want to process the lowest level one first so we don't accidentally
  // override anything. Sorting the list of registered fields gives eg. yhteyshenkilo before yhteyshenkilo[0].nimi.
  const sortedFields = Object.values(registeredFields)
    .map(f => f.name)
    .sort();

  // Ensure that the fields that are registered (visible) will be saved
  sortedFields.forEach(name => {
    const fieldName = getFieldNameWithoutLanguage(name);
    const fieldValue = get(values, fieldName!);

    const valueForSave = isEmptyTranslatedField(fieldValue) ? {} : fieldValue;
    set(saveableValues, fieldName!, valueForSave);
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

export const valueToArray = v => (isNil(v) ? [] : castArray(v));

export const safeArrayToValue = a => (size(a) > 1 ? a : get(a, 0));

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
  isNil(tyyppi) ? '' : `koulutustyypit.${camelCase(tyyppi)}`;

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
    return fromPairs(
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

type KieliArvo = { kieli: string; arvo: string };
type MultiSelectValue = Record<string, Array<{ label: string; value: string }>>;

export const kieliArvoListToMultiSelectValue = (
  list?: Array<KieliArvo>
): MultiSelectValue | undefined => {
  return list?.reduce<MultiSelectValue>((acc, curr) => {
    if (curr?.kieli && curr?.arvo) {
      return {
        ...acc,
        [curr.kieli]: [
          ...(acc[curr.kieli] ?? []),
          { label: curr.arvo, value: curr.arvo },
        ],
      };
    }
    return acc;
  }, {});
};

type SelectValuesByLanguage =
  | Partial<Record<LanguageCode, SelectOptions>>
  | undefined;

export const getTermsByLanguage = (
  values: SelectValuesByLanguage
): Array<{ kieli: string; arvo: string }> => {
  return flow(
    (values: SelectValuesByLanguage) => toPairs(values || {}),
    langTermTuples =>
      flatMap(langTermTuples, ([language, terms]: [string, SelectOptions]) => {
        return (terms || []).map(({ value }: SelectOption<string>) => ({
          kieli: language,
          arvo: value,
        }));
      })
  )(values);
};
