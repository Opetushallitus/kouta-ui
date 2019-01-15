import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import EducationForm from './index';
import { makeStoreDecorator } from '../../storybookUtils';

const Form = reduxForm({
  form: 'educationForm',
})(EducationForm);

storiesOf('EducationForm', module)
  .addDecorator(makeStoreDecorator())
  .add('Basic', () => <Form />);
