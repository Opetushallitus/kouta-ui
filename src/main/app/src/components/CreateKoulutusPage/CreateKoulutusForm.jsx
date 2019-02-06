import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import KoulutusForm, { validate } from '../KoulutusForm';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';
import { copy as copyKoulutus } from '../../state/createKoulutusForm';

export default compose(
  connect(null, dispatch => ({
    onCopy: koulutusOid => {
      dispatch(copyKoulutus(koulutusOid));
    },
  })),
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
      kieliversiot: {
        languages: ['fi', 'sv'],
      },
    },
  }),
)(KoulutusForm);
