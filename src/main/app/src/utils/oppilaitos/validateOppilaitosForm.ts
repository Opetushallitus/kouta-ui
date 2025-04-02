import _fp from 'lodash/fp';

import createErrorBuilder, {
  validateArray,
  validateArrayMinLength,
} from '#/src/utils/form/createErrorBuilder';
import {
  crossCheckWwwSivu,
  getKielivalinta,
  validateIfJulkaistu,
  validateOptionalTranslatedField,
} from '#/src/utils/form/formConfigUtils';

export const validateOppilaitosForm = values => {
  const kieliversiot = getKielivalinta(values);
  return _fp
    .flow(
      validateArrayMinLength('kieliversiot', 1),
      validateArray('yhteystiedot', eb =>
        eb.validateTranslations('nimi', kieliversiot)
      ),
      validateOptionalTranslatedField('hakijapalveluidenYhteystiedot.nimi'),
      validateIfJulkaistu(eb =>
        eb.validateTranslations('perustiedot.wwwSivuUrl', kieliversiot)
      ),
      crossCheckWwwSivu(kieliversiot)
    )(createErrorBuilder(values))
    .getErrors();
};
