import createErrorBuilder from './createErrorBuilder';

const validateOppilaitosForm = values => {
  const eb = createErrorBuilder(values);

  return eb.validateArrayMinLength('kieliversiot', 1).getErrors();
};

export default validateOppilaitosForm;
