import _fp from 'lodash/fp';

import { JULKAISUTILA, POHJAVALINTA } from '#/src/constants';
import createErrorBuilder, {
  validateArrayMinLength,
  validateExistence,
  validateTranslations,
} from '#/src/utils/form/createErrorBuilder';
import { validateIf, getKielivalinta } from '#/src/utils/form/formConfigUtils';

const validatePohja = eb =>
  validateIf(
    eb.values?.pohja?.tapa === POHJAVALINTA.KOPIO,
    validateExistence('pohja.valinta')
  )(eb);

const validateCommonFields = _fp.flow(validatePohja, validateExistence('tila'));

const validateSoraKuvausForm = values => {
  const { tila } = values;
  const isJulkaistu = tila === JULKAISUTILA.JULKAISTU;
  const kieliversiot = getKielivalinta(values);
  return _fp
    .flow(
      validateCommonFields,
      validateExistence('koulutustyyppi'),
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
