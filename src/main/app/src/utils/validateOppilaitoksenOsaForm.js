import createErrorBuilder from './createErrorBuilder';

const validateOppilaitoksenOsaForm = values => {
  const eb = createErrorBuilder(values);

  return eb.validateArrayMinLength('kieliversiot', 1).getErrors();
};

export default validateOppilaitoksenOsaForm;
