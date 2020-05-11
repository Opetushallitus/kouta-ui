import getToteutusFormConfig from './getToteutusFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateToteutusForm = values => {
  const { koulutustyyppi } = values;

  return getErrorBuilderByFormConfig(
    getToteutusFormConfig(koulutustyyppi),
    values
  ).getErrors();
};

export default validateToteutusForm;
