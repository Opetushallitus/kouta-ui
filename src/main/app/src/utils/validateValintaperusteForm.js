import get from 'lodash/get';

import { JULKAISUTILA } from '../constants';
import createErrorBuilder from './createErrorBuilder';

const getKieliversiot = values => get(values, 'kieliversiot') || [];

const validateEssentials = ({ errorBuilder, values }) => {
  const kieliversiot = getKieliversiot(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot', 1)
    .validateTranslations('kuvaus.nimi', kieliversiot);
};

const validateCommon = ({ errorBuilder, values }) => {
  const kieliversiot = getKieliversiot(values);

  return errorBuilder
    .validateExistence('hakutapa')
    .validateExistence('kohdejoukko')
    .validateArrayMinLength('valintatavat', 1, {
      isFieldArray: true,
    })
    .validateArray('valintatavat', eb => {
      return eb
        .validateExistence('tapa')
        .validateTranslations('nimi', kieliversiot);
    });
};

const validate = values => {
  const { tila } = values;

  let errorBuilder = createErrorBuilder(values);

  errorBuilder = validateEssentials({ errorBuilder, values });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ errorBuilder, values });

  return errorBuilder.getErrors();
};

export default validate;
