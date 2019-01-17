import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import ToteutusForm from './index';
import { makeStoreDecorator, makeApiDecorator } from '../../storybookUtils';

const Form = reduxForm({
  form: 'toteutusForm',
})(ToteutusForm);

storiesOf('ToteutusForm', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Form koulutusKoodiUri="koulutus_361101#11" />);
