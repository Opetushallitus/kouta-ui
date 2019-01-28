import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import HakuForm from './index';
import { makeStoreDecorator, makeApiDecorator } from '../../storybookUtils';

const Form = reduxForm({
  form: 'hakuForm',
})(HakuForm);

storiesOf('HakuForm', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Form steps={true} />);
