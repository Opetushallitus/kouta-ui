import getHakuFormConfig from './getHakuFormConfig';
import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

const validateHakuForm = values => {
  return getErrorBuilderByFormConfig(getHakuFormConfig(), values).getErrors();
};

export default validateHakuForm;
