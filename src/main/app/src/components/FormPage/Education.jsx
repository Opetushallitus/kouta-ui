import { reduxForm } from 'redux-form';

import EducationForm from '../EducationForm';

export default reduxForm({
  form: 'educationForm',
})(EducationForm);
