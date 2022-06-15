import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode } from '#/src/constants';

import SoraKuvausForm, { initialValues } from './index';

storiesOf('SoraKuvausForm', module).add('Basic', () => (
  <ReduxForm
    form={ENTITY.SORA_KUVAUS}
    initialValues={initialValues(['fi'])}
    mode={FormMode.CREATE}
  >
    <SoraKuvausForm
      organisaatioOid="1.2.246.562.10.594252633210"
      steps={false}
    />
  </ReduxForm>
));
