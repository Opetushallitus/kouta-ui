import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

import getToteutusFormConfig from './getToteutusFormConfig';

const validateToteutusForm = values => {
  const { koulutustyyppi } = values;

  return getErrorBuilderByFormConfig(
    getToteutusFormConfig(koulutustyyppi),
    values
  ).getErrors();
};

export default validateToteutusForm;
