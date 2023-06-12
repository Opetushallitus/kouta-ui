import _ from 'lodash';

import { serializeEditorState } from '../components/Editor/utils';

export const pickTranslations = (
  value: any,
  kielivalinta: Array<LanguageCode>
) => _.pick(value || {}, kielivalinta);

export const pickTranslationsForEditorField = (
  value: any,
  kielivalinta: Array<LanguageCode>
) => {
  return _.mapValues(_.pick(value || {}, kielivalinta), serializeEditorState);
};
