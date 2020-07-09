import getHakukohdeFormConfig from './getHakukohdeFormConfig';
import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

const validateHakukohdeForm = values => {
  return getErrorBuilderByFormConfig(
    getHakukohdeFormConfig(),
    values
  ).getErrors();
};

export default validateHakukohdeForm;
