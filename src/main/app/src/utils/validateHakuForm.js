import get from 'lodash/get';

import { JULKAISUTILA } from '../constants';
import createErrorBuilder from './createErrorBuilder';
import isYhteishakuHakutapa from './isYhteishakuHakutapa';
import isErillishakuHakutapa from './isErillishakuHakutapa';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateEssentials = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot', 1)
    .validateTranslations('nimi', kielivalinta);
};

const validateCommon = ({ values, errorBuilder }) => {
  const hakutapa = get(values, 'hakutapa');
  const isYhteishaku = isYhteishakuHakutapa(hakutapa);
  const isErillishaku = isErillishakuHakutapa(hakutapa);

  let enhancedErrorBuilder = errorBuilder
    .validateExistence('kohdejoukko.kohdejoukko')
    .validateExistence('hakutapa')
    .validateArrayMinLength('aikataulut.hakuaika', 1, { isFieldArray: true })
    .validateArray('aikataulut.hakuaika', eb => {
      if (isErillishaku || isYhteishaku) {
        return eb.validateExistence('alkaa').validateExistence('paattyy');
      }

      return eb.validateExistence('alkaa');
    });

  return enhancedErrorBuilder;
};

const validateHakuForm = values => {
  const { tila } = values;

  let errorBuilder = createErrorBuilder(values);

  errorBuilder = validateEssentials({ values, errorBuilder });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ values, errorBuilder });

  return errorBuilder.getErrors();
};

export default validateHakuForm;
