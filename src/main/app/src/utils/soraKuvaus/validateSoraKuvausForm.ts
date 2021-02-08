import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

import getSoraKuvausFormConfig from './getSoraKuvausFormConfig';

const validateSoraKuvausForm = values => {
  return getErrorBuilderByFormConfig(
    getSoraKuvausFormConfig(),
    values
  ).getErrors();
};

export default validateSoraKuvausForm;
