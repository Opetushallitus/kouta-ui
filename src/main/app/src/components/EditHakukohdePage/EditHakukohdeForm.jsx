import React, { useMemo } from 'react';

import HakukohdeForm from '../HakukohdeForm';
import getFormValuesByHakukohde from '../../utils/getFormValuesByHakukohde';
import ReduxForm from '../ReduxForm';
import getHakukohdeFormConfig from '../../utils/getHakukohdeFormConfig';
import FormConfigContext from '../FormConfigContext';

const config = getHakukohdeFormConfig();

const EditHakukohdeForm = ({ onSave, hakukohde, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByHakukohde(hakukohde);
  }, [hakukohde]);

  return (
    <ReduxForm form="editHakukohdeForm" initialValues={initialValues}>
      {() => (
        <FormConfigContext.Provider value={config}>
          <HakukohdeForm steps={false} {...props} />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  );
};

export default EditHakukohdeForm;
