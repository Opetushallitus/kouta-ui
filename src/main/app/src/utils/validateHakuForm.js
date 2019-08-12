import getHakuFormConfig from './getHakuFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateHakuForm = values => {
  return getErrorBuilderByFormConfig(getHakuFormConfig(), values).getErrors();
};

export default validateHakuForm;
