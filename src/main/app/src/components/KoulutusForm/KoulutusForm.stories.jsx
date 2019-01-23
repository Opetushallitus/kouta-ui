import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import KoulutusForm from './index';
import { makeStoreDecorator, makeApiDecorator } from '../../storybookUtils';

const Form = reduxForm({
  form: 'koulutusForm',
})(KoulutusForm);

storiesOf('KoulutusForm', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Form organisaatioOid="1.2.246.562.10.594252633210" steps={false} />);
