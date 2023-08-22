import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode } from '#/src/constants';

import SoraKuvausForm, { initialValues } from './index';

export default {
  title: 'SoraKuvausForm',
};

export const Basic = () => (
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
);
