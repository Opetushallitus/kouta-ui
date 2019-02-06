import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';

import HakuForm, { validate } from '../HakuForm';

export default compose(
  withProps(({ organisaatio }) => ({
    steps: true,
   // initialValues: getInitialValues({ organisaatio }),

  })),
  reduxForm({
    form: 'createHakuForm',
    validate,
  }),
)(HakuForm);
