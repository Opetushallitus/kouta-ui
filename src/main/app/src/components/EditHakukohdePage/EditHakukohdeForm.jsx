import { reduxForm } from 'redux-form';
import React, { useMemo } from 'react';

import HakukohdeForm from '../HakukohdeForm';
import getFormValuesByHakukohde from '../../utils/getFormValuesByHakukohde';

const HakukohdeReduxForm = reduxForm({
  form: 'editHakukohdeForm',
})(HakukohdeForm);

const EditHakukohdeForm = ({ onSave, hakukohde, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByHakukohde(hakukohde);
  }, [hakukohde]);

  return (
    <HakukohdeReduxForm
      {...props}
      hakukohde={hakukohde}
      steps={false}
      initialValues={initialValues}
    />
  );
};

export default EditHakukohdeForm;
