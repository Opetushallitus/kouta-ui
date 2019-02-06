import { reduxForm } from 'redux-form';

import ValintaperusteetForm, {
  validate,
  initialValues,
} from '../ValintaperusteetForm';

export default reduxForm({
  form: 'createValintaperusteetForm',
  validate,
  initialValues,
})(ValintaperusteetForm);
