import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import getOppilaitoksenOsaFormConfig from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaFormConfig';

import OppilaitoksenOsaForm, { initialValues } from './index';

storiesOf('OppilaitoksenOsaForm', module).add('Basic', () => (
  <ReduxForm form="oppilaitoksenOsaForm" initialValues={initialValues}>
    <FormConfigContext.Provider value={getOppilaitoksenOsaFormConfig()}>
      <OppilaitoksenOsaForm organisaatioOid="1.2.246.562.10.94639300915" />
    </FormConfigContext.Provider>
  </ReduxForm>
));
