import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';

import HakuForm, { validate } from '../HakuForm';

export default compose(
  withProps(({ organisaatio }) => ({
    steps: true,
<<<<<<< HEAD
   // initialValues: getInitialValues({ organisaatio }),


=======
>>>>>>> 61be369a29dcada655e9b3f1c1b3405c6b3c84f5
  })),
  reduxForm({
    form: 'createHakuForm',
    validate,
  }),
)(HakuForm);
