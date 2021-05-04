import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';
import isOphOrganisaatio from '#/src/utils/organisaatio/isOphOrganisaatio';

import getKoulutusFormConfig from './getKoulutusFormConfig';

const validateKoulutusForm = (values, registeredFields) => {
  const { koulutustyyppi } = values;
  const { organisaatioOid } = values;
  const minTarjoajat = isOphOrganisaatio(organisaatioOid) ? 0 : 1;

  return getErrorBuilderByFormConfig(getKoulutusFormConfig(koulutustyyppi), {
    ...values,
    minTarjoajat,
  }).getErrors();
};

export default validateKoulutusForm;
