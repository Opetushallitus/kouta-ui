import _fp from 'lodash/fp';

import createErrorBuilder, {
  validateArrayMinLength,
} from '#/src/utils/form/createErrorBuilder';

export const validateOppilaitoksenOsaForm = values => {
  return _fp
    .flow(validateArrayMinLength('kieliversiot', 1))(createErrorBuilder(values))
    .getErrors();
};
