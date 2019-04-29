import { reduxForm } from 'redux-form';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import HakuForm from '../HakuForm';
import { getValuesByHaku } from '../../state/createHakuForm';
import { attachHakukohde } from '../../state/editHakuForm/actions';

const HakuReduxForm = reduxForm({
  form: 'editHakuForm',
})(HakuForm);

const EditHakuForm = ({ onSave, haku, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesByHaku(haku);
  }, [haku]);

  return (
    <HakuReduxForm {...props} haku={haku} steps={false} canCopy={false} initialValues={initialValues} />
  );
};

export default connect(
  null,
  (dispatch, { haku: { oid: hakuOid, organisaatioOid, toteutusOid } }) => ({
    onAttachHakukohde: () => dispatch(attachHakukohde({ hakuOid, organisaatioOid, toteutusOid })),
  }),
)(EditHakuForm);
