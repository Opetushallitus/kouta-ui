import { reduxForm } from 'redux-form';
import React, { useMemo } from 'react';

import HakukohdeForm, { validate } from '../HakukohdeForm';
import { getValuesByHakukohde } from '../../state/createHakukohdeForm';

const HakukohdeReduxForm = reduxForm({
  form: 'editHakukohdeForm',
  validate,
})(HakukohdeForm);

const EditHakukohdeForm = ({ onSave, hakukohde, ...props }) => {
  const initialValues = useMemo(() => {
    return getValuesByHakukohde(hakukohde);
  }, [hakukohde]);

  return (
    <HakukohdeReduxForm {...props} hakukohde={hakukohde} steps={false} initialValues={initialValues} />
  );
};

export default EditHakukohdeForm;
