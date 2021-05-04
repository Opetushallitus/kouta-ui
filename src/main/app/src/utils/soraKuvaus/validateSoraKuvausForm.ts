import _fp from 'lodash/fp';

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

const validateCommonFields = _fp.flow(
  validateExistence('koulutustyyppi'),
  validatePohja,
  validateExistence('tila')
);

const validateSoraKuvausForm = values => {
  const { tila } = values;
  const isJulkaistu = tila === JULKAISUTILA.JULKAISTU;
  const kieliversiot = getKielivalinta(values);
  return _fp
    .flow(
      validateCommonFields,
      validateArrayMinLength('kieliversiot', 1),
      validateIf(
        isJulkaistu,
        validateTranslations('tiedot.kuvaus', kieliversiot)
      ),
      validateTranslations('tiedot.nimi', kieliversiot)
    )(createErrorBuilder(values))
    .getErrors();
};

export default validateSoraKuvausForm;
