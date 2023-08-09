import _fp from 'lodash/fp';

import {
  getFirstLanguageValue,
  arrayToTranslationObject,
} from '#/src/utils/languageUtils';

export const getKoodiNimiTranslation = (koodi?: Koodi, priority?: string) => {
  return getFirstLanguageValue(
    _fp.mapValues(_fp.prop('nimi'), arrayToTranslationObject(koodi?.metadata)),
    priority
  );
};

export default getKoodiNimiTranslation;
