import getSoraKuvausFormConfig from './getSoraKuvausFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateSoraKuvausForm = values => {
  return getErrorBuilderByFormConfig(
    getSoraKuvausFormConfig(),
    values,
  ).getErrors();
};

export default validateSoraKuvausForm;
