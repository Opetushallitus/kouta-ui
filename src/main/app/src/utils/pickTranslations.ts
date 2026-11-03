import { every, isEmpty, mapValues, pick } from 'lodash-es';

import { serializeEditorState } from '../components/LexicalEditorUI/utils';

export const getKielivalinta = (values): Array<LanguageCode> =>
  values?.kieliversiot || [];

export const pickTranslations = (
  value: any,
  kielivalinta: Array<LanguageCode>
) => pick(value || {}, kielivalinta);

export const pickAndSerializeTranslations = (
  value: any,
  kielivalinta: Array<LanguageCode>
) => {
  const translations = mapValues(
    pick(value || {}, kielivalinta),
    serializeEditorState
  );

  if (every(translations, isEmpty)) {
    return {};
  }

  return translations;
};

export const getKieleistyksetForKieliversiot =
  (kielivalinta: Array<LanguageCode>) => (value: any) =>
    pickTranslations(value, kielivalinta);

export const getKieleistyksetFromValues = values =>
  getKieleistyksetForKieliversiot(getKielivalinta(values));

export const getSerializedKieleistyksetFromKieliversiot =
  (kielivalinta: Array<LanguageCode>) => (value: any) =>
    pickAndSerializeTranslations(value, kielivalinta);

export const getSerializedKieleistykset = values =>
  getSerializedKieleistyksetFromKieliversiot(getKielivalinta(values));
