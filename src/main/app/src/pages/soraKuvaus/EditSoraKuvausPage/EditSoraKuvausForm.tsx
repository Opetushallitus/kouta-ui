import React, { useMemo } from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import SoraKuvausForm from '../SoraKuvausForm';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';

const EditSoraKuvausForm = ({ onSave, soraKuvaus, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesBySoraKuvaus(soraKuvaus);
  }, [soraKuvaus]);

  return (
    <ReduxForm form="soraKuvausForm" initialValues={initialValues}>
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
