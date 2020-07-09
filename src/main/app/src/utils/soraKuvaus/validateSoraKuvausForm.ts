import getSoraKuvausFormConfig from './getSoraKuvausFormConfig';
import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

const validateSoraKuvausForm = values => {
  return getErrorBuilderByFormConfig(
    getSoraKuvausFormConfig(),
    values
  ).getErrors();
};

export default validateSoraKuvausForm;
