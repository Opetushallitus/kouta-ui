import { get, mapValues } from 'lodash-es';

import {
  getFirstLanguageValue,
  arrayToTranslationObject,
} from '#/src/utils/languageUtils';

export const getKoodiNimiTranslation = (
  koodi?: Koodi,
  priority?: LanguageCode
) => {
  return getFirstLanguageValue(
    mapValues(arrayToTranslationObject(koodi?.metadata), v => get(v, 'nimi')),
    priority
  );
};

export default getKoodiNimiTranslation;
