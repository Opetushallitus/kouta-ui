import { reduxForm } from 'redux-form';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import KoulutusForm, { validate } from '../KoulutusForm';
import { getValuesByKoulutus } from '../../state/createKoulutusForm';
import { attachToteutus } from '../../state/editKoulutusForm';

const KoulutusReduxForm = reduxForm({
  form: 'editKoulutusForm',
  validate,
})(KoulutusForm);

const EditKoulutusForm = ({ onSave, koulutus, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesByKoulutus(koulutus);
  }, [koulutus]);

  return (
    <KoulutusReduxForm {...props} koulutus={koulutus} steps={false} canCopy={false} initialValues={initialValues} />
  );
};

export default connect(
  null,
  (dispatch, { koulutus: { oid: koulutusOid, organisaatioOid } }) => ({
    onAttachToteutus: () => dispatch(attachToteutus({ koulutusOid, organisaatioOid })),
  }),
)(EditKoulutusForm);
