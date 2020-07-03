import { get } from 'lodash';
import getValintaperusteFormConfig from './getValintaperusteFormConfig';
import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

const validateValintaperusteForm = values => {
  const koulutustyyppi = get(values, 'perustiedot.tyyppi');
  return getErrorBuilderByFormConfig(
    getValintaperusteFormConfig(koulutustyyppi),
    values
  ).getErrors();
};

export default validateValintaperusteForm;
