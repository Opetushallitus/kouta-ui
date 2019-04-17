import { reduxForm } from 'redux-form';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import ToteutusForm from '../ToteutusForm';
import { getValuesByToteutus } from '../../state/createToteutusForm';
import { attachHakukohde } from '../../state/editToteutusForm';

const ToteutusReduxForm = reduxForm({
  form: 'editToteutusForm',
})(ToteutusForm);

const EditToteutusForm = ({ onSave, toteutus, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesByToteutus(toteutus);
  }, [toteutus]);

  return (
    <ToteutusReduxForm
      {...props}
      toteutus={toteutus}
      steps={false}
      canCopy={false}
      initialValues={initialValues}
    />
  );
};

export default connect(
  null,
  (dispatch, { toteutus: { oid: toteutusOid, organisaatioOid } }) => ({
    onAttachHakukohde: () =>
      dispatch(attachHakukohde({ toteutusOid, organisaatioOid })),
  }),
)(EditToteutusForm);
