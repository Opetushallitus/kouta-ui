import _ from 'lodash';

import { serializeEditorState } from '../components/Editor/utils';

export const getKielivalinta = (values): Array<LanguageCode> =>
  values?.kieliversiot || [];

export const pickTranslations = (
  value: any,
  kielivalinta: Array<LanguageCode>
) => _.pick(value || {}, kielivalinta);

export const pickAndSerializeTranslations = (
  value: any,
  kielivalinta: Array<LanguageCode>
) => {
  return _.mapValues(_.pick(value || {}, kielivalinta), serializeEditorState);
};

const pickTranslationsCurried = _.curry(pickTranslations);
const pickAndSerializeTranslationsCurried = _.curry(
  pickAndSerializeTranslations
);

export const getKieleistyksetFromValues = values =>
  pickTranslationsCurried(_, getKielivalinta(values));

export const getKieleistyksetForKieliversiot = kieliversiot =>
  pickTranslationsCurried(_, kieliversiot);

export const getSerializedKieleistykset = values =>
  pickAndSerializeTranslationsCurried(_, getKielivalinta(values));

export const getSerializedKieleistyksetFromKieliversiot = kieliversiot =>
  pickAndSerializeTranslationsCurried(_, kieliversiot);
