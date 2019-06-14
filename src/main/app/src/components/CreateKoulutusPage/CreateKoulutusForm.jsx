import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import React, { useMemo } from 'react';

import KoulutusForm, { initialValues } from '../KoulutusForm';
import {
  copy as copyKoulutus,
  maybeCopy as maybeCopyKoulutus,
} from '../../state/createKoulutusForm';
import getFormValuesByKoulutus from '../../utils/getFormValuesByKoulutus';
import { getKoutaKoulutusByOid } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';

const resolveFn = () => Promise.resolve();

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

const getInitialValues = koulutus => {
  return koulutus
    ? { ...getCopyValues(koulutus.oid), ...getFormValuesByKoulutus(koulutus) }
    : initialValues;
};

const CreateKoulutusForm = props => {
  const { kopioKoulutusOid } = props;

  const promiseFn = kopioKoulutusOid ? getKoutaKoulutusByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioKoulutusOid,
    watch: kopioKoulutusOid,
  });

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return <KoulutusReduxForm {...props} steps initialValues={initialValues} />;
};

export default connect(
  null,
  dispatch => ({
    onCopy: koulutusOid => {
      dispatch(copyKoulutus(koulutusOid));
    },
    onMaybeCopy: () => {
      dispatch(maybeCopyKoulutus());
    },
  }),
)(CreateKoulutusForm);
