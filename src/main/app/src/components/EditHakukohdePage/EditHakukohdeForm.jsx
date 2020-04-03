import React, { useMemo } from 'react';

import HakukohdeForm from '../HakukohdeForm';
import getFormValuesByHakukohde from '../../utils/getFormValuesByHakukohde';
import getHakukohdeFormConfig from '../../utils/getHakukohdeFormConfig';
import FormConfigContext from '../FormConfigContext';
import useInitialValues from '#/src/components/useInitialValues';

const config = getHakukohdeFormConfig();

const EditHakukohdeForm = ({ onSave, hakukohde, ...props }) => {
  const initialValues = useMemo(() => {
    return getFormValuesByHakukohde(hakukohde);
  }, [hakukohde]);

  useInitialValues(initialValues);

  return (
    <FormConfigContext.Provider value={config}>
      <HakukohdeForm steps={false} {...props} />
    </FormConfigContext.Provider>
  );
};

export default EditHakukohdeForm;
