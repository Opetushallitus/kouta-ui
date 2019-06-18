import React, { useMemo } from 'react';

import ReduxForm from '../ReduxForm';
import SoraKuvausForm from '../SoraKuvausForm';
import { getValuesBySoraKuvaus } from '../../state/createSoraKuvausForm';

const EditSoraKuvausForm = ({ onSave, soraKuvaus, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesBySoraKuvaus(soraKuvaus);
  }, [soraKuvaus]);

  return (
    <ReduxForm form="editSoraKuvausForm" initialValues={initialValues}>
      {() => (
        <SoraKuvausForm
          {...props}
          soraKuvaus={soraKuvaus}
          steps={false}
          canCopy={false}
          canEditKoulutustyyppi={false}
        />
      )}
    </ReduxForm>
  );
};

export default EditSoraKuvausForm;
