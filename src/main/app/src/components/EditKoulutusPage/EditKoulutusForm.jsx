import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import ReduxForm from '../ReduxForm';
import KoulutusForm from '../KoulutusForm';
import getFormValuesByKoulutus from '../../utils/getFormValuesByKoulutus';
import { attachToteutus } from '../../state/editKoulutusForm';

const EditKoulutusForm = ({ onSave, koulutus, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByKoulutus(koulutus);
  }, [koulutus]);

  return (
    <ReduxForm form="editKoulutusForm" initialValues={initialValues}>
      {() => (
        <KoulutusForm
          steps={false}
          canCopy={false}
          canEditKoulutustyyppi={false}
          johtaaTutkintoon={Boolean(koulutus.johtaaTutkintoon)}
          {...props}
        />
      )}
    </ReduxForm>
  );
};

export default connect(
  null,
  (dispatch, { koulutus: { oid: koulutusOid, organisaatioOid } }) => ({
    onAttachToteutus: () =>
      dispatch(attachToteutus({ koulutusOid, organisaatioOid })),
  }),
)(EditKoulutusForm);
