import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';

import ToteutusForm from '../ToteutusForm';

const validate = values => {
  const errors = {};

  return errors;
};

export default compose(
  withProps({
    steps: true,
  }),
  reduxForm({
    form: 'createToteutusForm',
    validate,
    initialValues: {},
  }),
)(ToteutusForm);
