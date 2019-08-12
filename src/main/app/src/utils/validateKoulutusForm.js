import getKoulutusFormConfig from './getKoulutusFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateKoulutusForm = values => {
  const { koulutustyyppi } = values;

  return getErrorBuilderByFormConfig(
    getKoulutusFormConfig(koulutustyyppi),
    values,
  ).getErrors();
};

export default validateKoulutusForm;
