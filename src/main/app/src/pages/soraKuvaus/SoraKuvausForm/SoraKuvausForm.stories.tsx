import React from 'react';
import { storiesOf } from '@storybook/react';

import SoraKuvausForm, { initialValues } from './index';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import ReduxForm from '#/src/components/ReduxForm';
import getSoraKuvausFormConfig from '#/src/utils/soraKuvaus/getSoraKuvausFormConfig';

storiesOf('SoraKuvausForm', module).add('Basic', () => (
  <ReduxForm form="toteutus" initialValues={initialValues(['fi'])}>
    <FormConfigContext.Provider value={getSoraKuvausFormConfig()}>
      <SoraKuvausForm
        organisaatioOid="1.2.246.562.10.594252633210"
        steps={false}
      />
    </FormConfigContext.Provider>
  </ReduxForm>
));
