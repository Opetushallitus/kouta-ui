import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';

import HakuForm, { validate } from '../HakuForm';

export default compose(
  withProps(({ organisaatio }) => ({
    steps: true,
  })),
  reduxForm({
    form: 'createHakuForm',
    validate,
  }),
)(HakuForm);
