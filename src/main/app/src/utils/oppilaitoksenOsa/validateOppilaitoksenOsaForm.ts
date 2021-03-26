import _fp from 'lodash/fp';

import createErrorBuilder, {
  validateArray,
  validateArrayMinLength,
} from '#/src/utils/form/createErrorBuilder';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';

export const validateOppilaitoksenOsaForm = values => {
  const kieliversiot = getKielivalinta(values);
  return _fp
    .flow(
      validateArrayMinLength('kieliversiot', 1),
      validateArray('yhteystiedot', eb =>
        eb.validateTranslations('nimi', kieliversiot)
      )
    )(createErrorBuilder(values))
    .getErrors();
};
