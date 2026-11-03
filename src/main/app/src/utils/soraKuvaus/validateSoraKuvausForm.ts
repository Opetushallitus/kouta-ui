import { flow } from 'lodash-es';

import { JULKAISUTILA } from '#/src/constants';
import createErrorBuilder, {
  validateArrayMinLength,
  validateExistence,
  validateTranslations,
} from '#/src/utils/form/createErrorBuilder';
import {
  validateIf,
  getKielivalinta,
  validatePohja,
} from '#/src/utils/form/formConfigUtils';

const validateCommonFields = flow(
  validateExistence('koulutustyyppi'),
  validatePohja,
  validateExistence('tila')
);

const validateSoraKuvausForm = values => {
  const { tila } = values;
  const isJulkaistu = tila === JULKAISUTILA.JULKAISTU;
  const kieliversiot = getKielivalinta(values);
  return flow(
    validateCommonFields,
    validateExistence('organisaatioOid'),
    validateArrayMinLength('kieliversiot', 1),
    validateIf(
      isJulkaistu,
      validateTranslations('tiedot.kuvaus', kieliversiot)
    ),
    validateTranslations('tiedot.nimi', kieliversiot)
  )(createErrorBuilder(values)).getErrors();
};

export default validateSoraKuvausForm;
