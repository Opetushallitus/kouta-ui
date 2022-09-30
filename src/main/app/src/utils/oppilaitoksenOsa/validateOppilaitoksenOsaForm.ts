import _fp from 'lodash/fp';

import createErrorBuilder, {
  validateArrayMinLength,
  validateHakijapalveluidenYhteystiedot,
} from '#/src/utils/form/createErrorBuilder';
import {
  getKielivalinta,
  validateIfJulkaistu,
} from '#/src/utils/form/formConfigUtils';

export const validateOppilaitoksenOsaForm = values => {
  const kieliversiot = getKielivalinta(values);

  return _fp
    .flow(
      validateArrayMinLength('kieliversiot', 1),
      validateIfJulkaistu(eb =>
        eb.validateTranslations('perustiedot.wwwSivuUrl', kieliversiot)
      ),
      validateHakijapalveluidenYhteystiedot('hakijapalveluidenYhteystiedot', {
        message: 'validointivirheet.nimiJollainKielellaPakollinen',
        languages: kieliversiot,
      })
    )(createErrorBuilder(values))
    .getErrors();
};
