import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode } from '#/src/constants';

import OppilaitoksenOsaForm, { initialValues } from './index';

export default {
  title: 'OppilaitoksenOsaForm',
};

export const Basic = () => (
  <ReduxForm
    form={ENTITY.OPPILAITOKSEN_OSA}
    initialValues={initialValues}
    mode={FormMode.CREATE}
  >
    <OppilaitoksenOsaForm organisaatioOid="1.2.246.562.10.94639300915" />
  </ReduxForm>
);
