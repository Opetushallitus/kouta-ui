import get from 'lodash/get';
import mapValues from 'lodash/mapValues';

import { getFirstLanguageValue, arrayToTranslationObject } from './index';

const getKoodiNimiTranslation = (koodi, priority) => {
  const translationObject = mapValues(
    arrayToTranslationObject(get(koodi, 'metadata')),
    ({ nimi }) => nimi,
  );

  return getFirstLanguageValue(translationObject, priority);
};

export default getKoodiNimiTranslation;
