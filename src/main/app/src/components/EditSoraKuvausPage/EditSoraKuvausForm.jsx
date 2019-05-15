import { reduxForm } from 'redux-form';
import React, { useMemo } from 'react';

import SoraKuvausForm from '../SoraKuvausForm';
import { getValuesBySoraKuvaus } from '../../state/createSoraKuvausForm';

const SoraKuvausReduxForm = reduxForm({
  form: 'editSoraKuvausForm',
})(SoraKuvausForm);

const EditSoraKuvausForm = ({ onSave, soraKuvaus, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesBySoraKuvaus(soraKuvaus);
  }, [soraKuvaus]);

  return (
    <SoraKuvausReduxForm
      {...props}
      soraKuvaus={soraKuvaus}
      steps={false}
      canCopy={false}
      canEditKoulutustyyppi={false}
      initialValues={initialValues}
    />
  );
};

export default EditSoraKuvausForm;
