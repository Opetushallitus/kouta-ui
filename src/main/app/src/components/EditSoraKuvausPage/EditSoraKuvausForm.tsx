import React, { useMemo } from 'react';

import ReduxForm from '../ReduxForm';
import SoraKuvausForm from '../SoraKuvausForm';
import getFormValuesBySoraKuvaus from '../../utils/getFormValuesBySoraKuvaus';

const EditSoraKuvausForm = ({ onSave, soraKuvaus, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesBySoraKuvaus(soraKuvaus);
  }, [soraKuvaus]);

  return (
    <ReduxForm form="editSoraKuvausForm" initialValues={initialValues}>
      {() => (
        <SoraKuvausForm
          {...props}
          soraKuvaus={soraKuvaus}
          steps={false}
          canSelectBase={false}
          canEditKoulutustyyppi={false}
        />
      )}
    </ReduxForm>
  );
};

export default EditSoraKuvausForm;
