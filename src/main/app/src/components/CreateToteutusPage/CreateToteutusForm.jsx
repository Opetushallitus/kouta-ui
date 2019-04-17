import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';
import memoize from 'memoizee';

import ToteutusForm, { initialValues } from '../ToteutusForm';
import {
  getValuesByToteutus,
  maybeCopy as maybeCopyToteutus,
} from '../../state/createToteutusForm';
import { getKoutaToteutusByOid } from '../../apiUtils';
import ApiAsync from '../ApiAsync';
import { POHJAVALINNAT } from '../../constants';

const resolveFn = () => Promise.resolve({});

const ToteutusReduxForm = reduxForm({
  form: 'createToteutusForm',
  enableReinitialize: true,
})(ToteutusForm);

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINNAT.KOPIO,
    valinta: { value: toteutusOid },
  },
});

const getInitialValues = memoize(toteutus => {
  return toteutus.oid
    ? { ...getCopyValues(toteutus.oid), ...getValuesByToteutus(toteutus) }
    : initialValues;
});

const CreateToteutusForm = props => {
  const { kopioToteutusOid } = props;

  const promiseFn = kopioToteutusOid ? getKoutaToteutusByOid : resolveFn;

  return (
    <ApiAsync
      promiseFn={promiseFn}
      oid={kopioToteutusOid}
      watch={kopioToteutusOid}
    >
      {({ data }) => {
        return data ? (
          <ToteutusReduxForm
            {...props}
            steps
            initialValues={
              kopioToteutusOid ? getInitialValues(data) : initialValues
            }
          />
        ) : null;
      }}
    </ApiAsync>
  );
};

export default compose(
  connect(
    null,
    dispatch => ({
      onMaybeCopy: () => {
        dispatch(maybeCopyToteutus());
      },
    }),
  ),
)(CreateToteutusForm);
