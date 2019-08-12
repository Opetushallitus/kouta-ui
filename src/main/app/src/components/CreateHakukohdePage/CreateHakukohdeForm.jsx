import React from 'react';
import HakukohdeForm, { initialValues } from '../HakukohdeForm';
import ReduxForm from '../ReduxForm';
import getHakukohdeFormConfig from '../../utils/getHakukohdeFormConfig';
import FormConfigContext from '../FormConfigContext';

const config = getHakukohdeFormConfig();

const CreateHakukohdeForm = props => (
  <ReduxForm form="createHakukohdeForm" initialValues={initialValues}>
    {() => (
      <FormConfigContext.Provider value={config}>
        <HakukohdeForm steps {...props} />
      </FormConfigContext.Provider>
    )}
  </ReduxForm>
);

export default CreateHakukohdeForm;
