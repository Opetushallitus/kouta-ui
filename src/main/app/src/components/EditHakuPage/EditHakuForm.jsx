import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import HakuForm from '../HakuForm';
import getFormValuesByHaku from '../../utils/getFormValuesByHaku';
import { attachHakukohde } from '../../state/editHakuForm/actions';
import ReduxForm from '../ReduxForm';

const EditHakuForm = ({ onSave, haku, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByHaku(haku);
  }, [haku]);

  return (
    <ReduxForm form="editHakuForm" initialValues={initialValues}>
      {() => (
        <HakuForm
          steps={false}
          initialValues={initialValues}
          haku={haku}
          canCopy={false}
          {...props}
        />
      )}
    </ReduxForm>
  );
};

export default connect(
  null,
  (dispatch, { haku: { oid: hakuOid, organisaatioOid, toteutusOid } }) => ({
    onAttachHakukohde: () =>
      dispatch(attachHakukohde({ hakuOid, organisaatioOid, toteutusOid })),
  }),
)(EditHakuForm);
