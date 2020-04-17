import getOppilaitosFormConfig from './getOppilaitosFormConfig';
import getErrorBuilderByFormConfig from './getErrorBuilderByFormConfig';

const validateOppilaitosForm = values => {
  return getErrorBuilderByFormConfig(
    getOppilaitosFormConfig(),
    values,
  ).getErrors();
};

export default validateOppilaitosForm;
