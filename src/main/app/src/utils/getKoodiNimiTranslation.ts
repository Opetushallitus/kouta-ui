import { get, mapValues } from 'lodash';

import { getFirstLanguageValue, arrayToTranslationObject } from './index';

const getKoodiNimiTranslation = (koodi, priority) => {
  const translationObject = mapValues(
    arrayToTranslationObject(get(koodi, 'metadata')),
    ({ nimi }) => nimi
  );

  return getFirstLanguageValue(translationObject, priority);
};

export default getKoodiNimiTranslation;
