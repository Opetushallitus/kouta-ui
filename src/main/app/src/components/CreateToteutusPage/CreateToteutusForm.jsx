import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';

import ToteutusForm, { initialValues, validate } from '../ToteutusForm';

export default compose(
  withProps({
    steps: true,
  }),
  reduxForm({
    form: 'createToteutusForm',
    validate,
    initialValues,
  }),
)(ToteutusForm);
