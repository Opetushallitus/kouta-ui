import getHakukohdeFormConfig from './getHakukohdeFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateHakukohdeForm = values => {
  return getErrorBuilderByFormConfig(
    getHakukohdeFormConfig(),
    values
  ).getErrors();
};

export default validateHakukohdeForm;
