import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import SoraKuvausForm from './index';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

const Form = reduxForm({
  form: 'soraKuvausForm',
})(SoraKuvausForm);

storiesOf('SoraKuvausForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <Form organisaatioOid="1.2.246.562.10.594252633210" steps={false} />
  ));
