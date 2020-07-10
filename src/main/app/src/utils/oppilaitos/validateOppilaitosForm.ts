import getOppilaitosFormConfig from './getOppilaitosFormConfig';
import getErrorBuilderByFormConfig from '#/src/utils/form/getErrorBuilderByFormConfig';

const validateOppilaitosForm = values => {
  return getErrorBuilderByFormConfig(
    getOppilaitosFormConfig(),
    values
  ).getErrors();
};

export default validateOppilaitosForm;
