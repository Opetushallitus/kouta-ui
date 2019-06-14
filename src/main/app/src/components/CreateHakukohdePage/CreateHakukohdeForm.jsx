import { reduxForm } from 'redux-form';

import HakukohdeForm, { initialValues } from '../HakukohdeForm';

const CreateHakukohdeForm = reduxForm({
  form: 'createHakukohdeForm',
  initialValues,
})(HakukohdeForm);

export default CreateHakukohdeForm;
