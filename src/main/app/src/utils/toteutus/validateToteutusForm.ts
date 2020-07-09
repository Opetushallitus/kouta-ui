import getToteutusFormConfig from './getToteutusFormConfig';
import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

const validateToteutusForm = values => {
  const { koulutustyyppi } = values;

  return getErrorBuilderByFormConfig(
    getToteutusFormConfig(koulutustyyppi),
    values
  ).getErrors();
};

export default validateToteutusForm;
