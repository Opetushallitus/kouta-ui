import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';

import HakukohdeForm, { getInitialValues } from '../HakukohdeForm';

export default compose(
  withProps(({ organisaatio }) => ({
    steps: true,
    initialValues: getInitialValues({ organisaatio }),
  })),
  reduxForm({
    form: 'createHakukohdeForm',
  }),
)(HakukohdeForm);
