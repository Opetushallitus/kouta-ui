import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import ToteutusForm from '../ToteutusForm';
import { getValuesByToteutus } from '../../state/createToteutusForm';
import { attachHakukohde } from '../../state/editToteutusForm';
import ReduxForm from '../ReduxForm';

const EditToteutusForm = ({ onSave, toteutus, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesByToteutus(toteutus);
  }, [toteutus]);

  return (
    <ReduxForm form="editToteutusForm" initialValues={initialValues}>
      {() => (
        <ToteutusForm
          {...props}
          toteutus={toteutus}
          steps={false}
          canCopy={false}
        />
      )}
    </ReduxForm>
  );
};

export default connect(
  null,
  (dispatch, { toteutus: { oid: toteutusOid, organisaatioOid } }) => ({
    onAttachHakukohde: () =>
      dispatch(attachHakukohde({ toteutusOid, organisaatioOid })),
  }),
)(EditToteutusForm);
