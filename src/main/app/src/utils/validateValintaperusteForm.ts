import { get } from 'lodash';
import getValintaperusteFormConfig from './getValintaperusteFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateValintaperusteForm = values => {
  const koulutustyyppi = get(values, 'perustiedot.tyyppi');
  return getErrorBuilderByFormConfig(
    getValintaperusteFormConfig(koulutustyyppi),
    values
  ).getErrors();
};

export default validateValintaperusteForm;
