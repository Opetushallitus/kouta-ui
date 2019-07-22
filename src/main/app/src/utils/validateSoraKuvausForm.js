import get from 'lodash/get';

import { JULKAISUTILA } from '../constants';
import createErrorBuilder from './createErrorBuilder';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateEssentials = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot', 1)
    .validateTranslations('tiedot.nimi', kielivalinta);
};

const validateCommon = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateTranslations('tiedot.kuvaus', kielivalinta)
    .validateExistence('koulutustyyppi');
};

const validateSoraKuvausForm = values => {
  const { tila } = values;

  let errorBuilder = createErrorBuilder(values);

  errorBuilder = validateEssentials({ values, errorBuilder });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ values, errorBuilder });

  return errorBuilder.getErrors();
};

export default validateSoraKuvausForm;
