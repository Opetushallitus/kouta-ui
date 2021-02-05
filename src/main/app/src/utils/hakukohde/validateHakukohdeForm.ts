import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

import getHakukohdeFormConfig from './getHakukohdeFormConfig';

const validateHakukohdeForm = values => {
  return getErrorBuilderByFormConfig(
    getHakukohdeFormConfig(),
    values
  ).getErrors();
};

export default validateHakukohdeForm;
