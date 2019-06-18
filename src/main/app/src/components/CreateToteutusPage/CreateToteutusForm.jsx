import { connect } from 'react-redux';
import React, { useMemo } from 'react';

import ToteutusForm, { initialValues } from '../ToteutusForm';
import {
  getValuesByToteutus,
  maybeCopy as maybeCopyToteutus,
} from '../../state/createToteutusForm';

import { getKoutaToteutusByOid } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import ReduxForm from '../ReduxForm';

const resolveFn = () => Promise.resolve();

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: toteutusOid },
  },
});

const getInitialValues = toteutus => {
  return toteutus
    ? { ...getCopyValues(toteutus.oid), ...getValuesByToteutus(toteutus) }
    : initialValues;
};

const CreateToteutusForm = props => {
  const { kopioToteutusOid } = props;

  const promiseFn = kopioToteutusOid ? getKoutaToteutusByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioToteutusOid,
    watch: kopioToteutusOid,
  });

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm
      form="createToteutusForm"
      initialValues={initialValues}
      enableReinitialize
    >
      {() => <ToteutusForm steps {...props} />}
    </ReduxForm>
  );
};

export default connect(
  null,
  dispatch => ({
    onMaybeCopy: () => {
      dispatch(maybeCopyToteutus());
    },
  }),
)(CreateToteutusForm);
