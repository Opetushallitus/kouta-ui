import get from 'lodash/get';

import { JULKAISUTILA } from '../constants';
import createErrorBuilder from './createErrorBuilder';
import isKorkeakouluKoulutustyyppi from './isKorkeakouluKoulutustyyppi';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateEssentials = ({ errorBuilder }) => {
  return errorBuilder
    .validateArrayMinLength('kieliversiot', 1)
    .validateExistence('information.koulutus');
};

const validateCommon = ({ errorBuilder }) => {
  return errorBuilder.validateArrayMinLength('tarjoajat', 1);
};

const validateKorkeakoulu = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder.validateTranslations('description.kuvaus', kielivalinta);
};

const validateKoulutusForm = ({ values, koulutustyyppi, tila }) => {
  let errorBuilder = createErrorBuilder({ values });

  errorBuilder = validateEssentials({ errorBuilder, values });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ values, errorBuilder });

  if (isKorkeakouluKoulutustyyppi(koulutustyyppi)) {
    errorBuilder = validateKorkeakoulu({ values, errorBuilder });
  }

  return errorBuilder.getErrors();
};

export default validateKoulutusForm;
