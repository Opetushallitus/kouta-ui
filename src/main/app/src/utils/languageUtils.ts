import {
  isArray,
  isEmpty,
  isObject,
  isString,
  pick,
  pickBy,
  toPairs,
  zipObject,
} from 'lodash';
import { match } from 'ts-pattern';

import { Osoite } from '#/src/types/domainTypes';
import { formValueExists } from '#/src/utils';

export const getLanguageValue = (
  value?: TranslatedField,
  language: string = 'fi'
) => (isObject(value) ? value[language] || null : null);

export const getFirstLanguageValue = (
  value?: TranslatedField,
  priorityArg?: Array<string> | string
) => {
  const defaultPriority: Array<string> = ['fi', 'en', 'sv'];

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
  obj?: Record<LanguageCode, any>,
  languages: Array<LanguageCode> = [],
  validate = formValueExists,
  optional: boolean = false
) => {
  if (optional) {
    const existingValues = pickBy(obj, formValueExists);
    if (isEmpty(existingValues)) {
      return [];
    }
  }

  if (!isObject(obj)) {
    return languages;
  }

  const translationObj = {
    ...zipObject(languages),
    ...pick(obj, languages),
  };

  return toPairs(translationObj)
    .filter(([, value]) => !validate(value))
    .map(([language]) => language);
};

export const getKielistettyOsoite = (
  osoite?: Osoite,
  koodi?: Koodi,
  language: string = 'fi'
) => {
  const postinumeroMetadata = arrayToTranslationObject(koodi?.metadata);
  const postitoimipaikka = match(postinumeroMetadata)
    .when(
      pnro => !isEmpty(pnro[language]),
      pnro => pnro[language].nimi
    )
    .when(
      pnro => !isEmpty(pnro['fi']),
      pnro => pnro['fi'].nimi
    )
    .otherwise(() => '');

  const kielistettyKatuosoite = getFirstLanguageValue(osoite?.osoite, language);

  const postinumero = koodi?.koodiArvo;
  const kielistettyOsoite = kielistettyKatuosoite
    ? `${kielistettyKatuosoite}${postinumero ? `, ${postinumero}` : ''}${
        postitoimipaikka ? ` ${postitoimipaikka}` : ''
      }`
    : '';
  return kielistettyOsoite;
};
