import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import HakuForm from './index';
import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

const Form = reduxForm({
  form: 'hakuForm',
})(HakuForm);

storiesOf('HakuForm', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <Form
      organisaatioOid="1.2.246.562.10.594252633210"
    />
  ));
