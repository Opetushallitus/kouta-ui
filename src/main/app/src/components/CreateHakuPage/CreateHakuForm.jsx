import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';
import memoize from 'memoizee';

import HakuForm, { initialValues } from '../HakuForm';
import {
  copy as copyHaku,
  maybeCopy as maybeCopyHaku,
  getValuesByHaku,
} from '../../state/createHakuForm';
import { getKoutaHakuByOid } from '../../apiUtils';
import ApiAsync from '../ApiAsync';
import { POHJAVALINTA } from '../../constants';

const resolveFn = () => Promise.resolve({});

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

const getInitialValues = memoize(haku => {
  return haku.oid
    ? { ...getCopyValues(haku.oid), ...getValuesByHaku(haku) }
    : initialValues;
});

const CreateHakuForm = props => {
  const { kopioHakuOid } = props;

  const promiseFn = kopioHakuOid ? getKoutaHakuByOid : resolveFn;

  return (
    <ApiAsync promiseFn={promiseFn} oid={kopioHakuOid} watch={kopioHakuOid}>
      {({ data }) => {
        return data ? (
          <HakuReduxForm
            {...props}
            steps
            initialValues={
              kopioHakuOid ? getInitialValues(data) : initialValues
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
      onCopy: hakuOid => {
        dispatch(copyHaku(hakuOid));
      },
      onMaybeCopy: () => {
        dispatch(maybeCopyHaku());
      },
    }),
  ),
)(CreateHakuForm);
