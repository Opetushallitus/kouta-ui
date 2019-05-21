import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import ToteutusForm from './index';
import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';
import { KOULUTUSTYYPPI } from '../../constants';

const Form = reduxForm({
  form: 'toteutusForm',
})(ToteutusForm);

storiesOf('ToteutusForm', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <Form
      koulutusKoodiUri="koulutus_361101#11"
      organisaatioOid="1.2.246.562.10.594252633210"
      steps={false}
      koulutustyyppi={KOULUTUSTYYPPI.YLIOPISTOKOULUTUS}
    />
  ));
