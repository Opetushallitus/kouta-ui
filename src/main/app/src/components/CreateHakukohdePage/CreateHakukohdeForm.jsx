import React from 'react';
import HakukohdeForm, { initialValues } from '../HakukohdeForm';
import ReduxForm from '../ReduxForm';

const CreateHakukohdeForm = props => (
  <ReduxForm form="createHakukohdeForm" initialValues={initialValues}>
    {() => <HakukohdeForm steps {...props} />}
  </ReduxForm>
);

export default CreateHakukohdeForm;
