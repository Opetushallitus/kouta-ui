import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';
import memoize from 'memoizee';

import KoulutusForm, { validate, initialValues } from '../KoulutusForm';
import {
  copy as copyKoulutus,
  maybeCopy as maybeCopyKoulutus,
  getValuesByKoulutus,
  saveAndAttachToteutus,
} from '../../state/createKoulutusForm';
import { getKoutaKoulutusByOid } from '../../apiUtils';
import ApiAsync from '../ApiAsync';

const resolveFn = () => Promise.resolve({});

const KoulutusReduxForm = reduxForm({
  form: 'createKoulutusForm',
  validate,
  enableReinitialize: true,
})(KoulutusForm);

const getCopyValues = koulutusOid => ({
  base: {
    base: 'copy_koulutus',
    education: { value: koulutusOid },
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

  return (
    <ApiAsync
      promiseFn={promiseFn}
      oid={kopioKoulutusOid}
      watch={kopioKoulutusOid}
    >
      {({ data }) => {
        return data ? (
          <KoulutusReduxForm
            {...props}
            steps
            initialValues={
              kopioKoulutusOid ? getInitialValues(data) : initialValues
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
      onCopy: koulutusOid => {
        dispatch(copyKoulutus(koulutusOid));
      },
      onMaybeCopy: () => {
        dispatch(maybeCopyKoulutus());
      },
      onSaveAndAttachToteutus: () => {
        dispatch(saveAndAttachToteutus());
      },
    }),
  ),
)(CreateKoulutusForm);
