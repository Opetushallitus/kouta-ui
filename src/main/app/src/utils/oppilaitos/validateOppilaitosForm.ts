import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

import getOppilaitosFormConfig from './getOppilaitosFormConfig';

const validateOppilaitosForm = values => {
  return getErrorBuilderByFormConfig(
    getOppilaitosFormConfig(),
    values
  ).getErrors();
};

export default validateOppilaitosForm;
