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
  .add('Basic', () => <Form koulutusKoodiUri="koulutus_361101#11" organisaatioOid="1.2.246.562.10.594252633210" steps={false} />);
