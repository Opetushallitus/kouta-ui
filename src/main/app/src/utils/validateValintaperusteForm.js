import getValintaperusteFormConfig from "./getValintaperusteFormConfig";
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateValintaperusteForm = values => {
  return getErrorBuilderByFormConfig(getValintaperusteFormConfig(), values).getErrors();
};

export default validateValintaperusteForm;
