import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from './ReduxForm';
import SoraKuvausSection from './SoraKuvausSection';
import { ENTITY, FormMode } from '../constants';

storiesOf('SoraKuvausSection', module).add('Basic', () => (
  <ReduxForm
    form={ENTITY.SORA_KUVAUS}
    initialValues={{}}
    mode={FormMode.CREATE}
  >
    <SoraKuvausSection
      organisaatioOid="1.2.246.562.10.94639300915"
      name="soraKuvaus"
      languages={['fi']}
    />
  </ReduxForm>
));
