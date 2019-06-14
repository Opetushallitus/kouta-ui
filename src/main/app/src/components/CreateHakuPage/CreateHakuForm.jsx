import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import React, { useMemo } from 'react';

import HakuForm, { initialValues } from '../HakuForm';
import {
  copy as copyHaku,
  maybeCopy as maybeCopyHaku,
} from '../../state/createHakuForm';
import { getKoutaHakuByOid } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { POHJAVALINTA } from '../../constants';
import getFormValuesByHaku from '../../utils/getFormValuesByHaku';

const resolveFn = () => Promise.resolve();

const HakuReduxForm = reduxForm({
  form: 'createHakuForm',
  enableReinitialize: true,
})(HakuForm);

const getCopyValues = hakuOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: hakuOid },
  },
});

const getInitialValues = haku => {
  return haku
    ? { ...getCopyValues(haku.oid), ...getFormValuesByHaku(haku) }
    : initialValues;
};

const CreateHakuForm = props => {
  const { kopioHakuOid } = props;

  const promiseFn = kopioHakuOid ? getKoutaHakuByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioHakuOid,
    watch: kopioHakuOid,
  });

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return <HakuReduxForm {...props} steps initialValues={initialValues} />;
};

export default connect(
  null,
  dispatch => ({
    onCopy: hakuOid => {
      dispatch(copyHaku(hakuOid));
    },
    onMaybeCopy: () => {
      dispatch(maybeCopyHaku());
    },
  }),
)(CreateHakuForm);
