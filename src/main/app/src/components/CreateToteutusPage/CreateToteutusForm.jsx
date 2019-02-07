import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import ToteutusForm, { initialValues, validate } from '../ToteutusForm';
import { copy as copyToteutus } from '../../state/createToteutusForm';

export default compose(
  connect(null, dispatch => ({
    onCopy: toteutusOid => {
      dispatch(copyToteutus(toteutusOid));
    },
  })),
  withProps({
    steps: true,
  }),
  reduxForm({
    form: 'createToteutusForm',
    validate,
    initialValues,
  }),
)(ToteutusForm);
