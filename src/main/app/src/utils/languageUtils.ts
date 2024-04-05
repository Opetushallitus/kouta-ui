import _ from 'lodash';
import { match } from 'ts-pattern';

import { Osoite } from '#/src/types/domainTypes';
import { formValueExists } from '#/src/utils';

export const getLanguageValue = (
  value?: TranslatedField,
  language: string = 'fi'
) => (_.isObject(value) ? value[language] || null : null);

export const getFirstLanguageValue = (
  value?: TranslatedField,
  priorityArg?: Array<string> | string
) => {
  const defaultPriority: Array<string> = ['fi', 'en', 'sv'];

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
  obj?: Record<LanguageCode, any>,
  languages: Array<LanguageCode> = [],
  validate = formValueExists,
  optional: boolean = false
) => {
  if (optional) {
    const existingValues = _.pickBy(obj, formValueExists);
    if (_.isEmpty(existingValues)) {
      return [];
    }
  }

  if (!_.isObject(obj)) {
    return languages;
  }

  const translationObj = {
    ..._.zipObject(languages),
    ..._.pick(obj, languages),
  };

  return _.toPairs(translationObj)
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
