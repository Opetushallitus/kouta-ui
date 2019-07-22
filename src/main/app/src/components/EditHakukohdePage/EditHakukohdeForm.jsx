import React, { useMemo } from 'react';

import HakukohdeForm from '../HakukohdeForm';
import getFormValuesByHakukohde from '../../utils/getFormValuesByHakukohde';
import ReduxForm from '../ReduxForm';

const EditHakukohdeForm = ({ onSave, hakukohde, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByHakukohde(hakukohde);
  }, [hakukohde]);

  return (
    <ReduxForm form="editHakukohdeForm" initialValues={initialValues}>
      {() => <HakukohdeForm steps={false} {...props} />}
    </ReduxForm>
  );
};

export default EditHakukohdeForm;
