import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';

import KoulutusForm, { initialValues } from '../KoulutusForm';
import {
  copy as copyKoulutus,
  maybeCopy as maybeCopyKoulutus,
  getValuesByKoulutus,
} from '../../state/createKoulutusForm';
import { getKoutaKoulutusByOid } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import { memoize } from '../../utils';

const resolveFn = () => Promise.resolve({});

const KoulutusReduxForm = reduxForm({
  form: 'createKoulutusForm',
  enableReinitialize: true,
})(KoulutusForm);

const getCopyValues = koulutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: koulutusOid },
  },
});

const getInitialValues = memoize(koulutus => {
  return koulutus.oid
    ? { ...getCopyValues(koulutus.oid), ...getValuesByKoulutus(koulutus) }
    : initialValues;
});

const CreateKoulutusForm = props => {
  const { kopioKoulutusOid } = props;

  const promiseFn = kopioKoulutusOid ? getKoutaKoulutusByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioKoulutusOid,
    watch: kopioKoulutusOid,
  });

  return data ? (
    <KoulutusReduxForm
      {...props}
      steps
      initialValues={kopioKoulutusOid ? getInitialValues(data) : initialValues}
    />
  ) : null;
};

export default compose(
  connect(
    null,
    dispatch => ({
      onCopy: koulutusOid => {
        dispatch(copyKoulutus(koulutusOid));
      },
      onMaybeCopy: () => {
        dispatch(maybeCopyKoulutus());
      },
    }),
  ),
)(CreateKoulutusForm);
