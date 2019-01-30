import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';

import KoulutusForm, { validate } from '../KoulutusForm';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';

export default compose(
  withProps({
    steps: true,
  }),
  reduxForm({
    form: 'createKoulutusForm',
    validate,
    initialValues: {
      type: {
        type: KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
      },
      language: {
        fi: true,
        sv: true,
        en: false,
      },
    },
  }),
)(KoulutusForm);
