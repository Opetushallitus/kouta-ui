import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import ValintaperusteetForm from './index';
import { makeStoreDecorator, makeApiDecorator } from '../../storybookUtils';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';

const Form = reduxForm({
  form: 'valintaperusteetForm',
})(ValintaperusteetForm);

storiesOf('ValintaperusteetForm', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Form steps={false} organisaatioOid="1.2.246.562.10.594252633210" koulutustyyppi={KOULUTUSTYYPPI_CATEGORY.YLIOPISTOKOULUTUS} />);
