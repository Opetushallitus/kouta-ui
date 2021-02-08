import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

import getHakuFormConfig from './getHakuFormConfig';

const validateHakuForm = values => {
  return getErrorBuilderByFormConfig(getHakuFormConfig(), values).getErrors();
};

export default validateHakuForm;
