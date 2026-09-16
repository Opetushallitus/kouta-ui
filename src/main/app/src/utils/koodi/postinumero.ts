import { upperFirst } from 'lodash';

import { getKoodiNimiTranslation } from '../getKoodiNimiTranslation';

export const getPostinumeroKoodiLabel = (
  koodi: any, // TODO: Tämä ei ole Koodi vaan parsittu koodi
  language: LanguageCode
) =>
  `${koodi?.koodiArvo} ${upperFirst(
    getKoodiNimiTranslation(koodi, language)?.toLowerCase() ?? ''
  )}`;
