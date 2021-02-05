import { get } from 'lodash';

import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

import getValintaperusteFormConfig from './getValintaperusteFormConfig';

const validateValintaperusteForm = values => {
  const koulutustyyppi = get(values, 'perustiedot.tyyppi');
  return getErrorBuilderByFormConfig(
    getValintaperusteFormConfig(koulutustyyppi),
    values
  ).getErrors();
};

export default validateValintaperusteForm;
