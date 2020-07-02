import getKoulutusFormConfig from './getKoulutusFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';
import isOphOrganisaatio from './isOphOrganisaatio';

const validateKoulutusForm = values => {
  const { koulutustyyppi } = values;
  const { organisaatioOid } = values;
  const minTarjoajat = isOphOrganisaatio(organisaatioOid) ? 0 : 1;

  return getErrorBuilderByFormConfig(getKoulutusFormConfig(koulutustyyppi), {
    ...values,
    minTarjoajat,
  }).getErrors();
};

export default validateKoulutusForm;
