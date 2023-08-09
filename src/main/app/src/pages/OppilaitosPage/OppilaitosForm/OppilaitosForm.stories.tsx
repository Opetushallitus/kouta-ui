import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode } from '#/src/constants';

import OppilaitosForm, { initialValues } from './index';

export default {
  title: 'OppilaitosForm',
};

export const Basic = () => (
  <ReduxForm
    form={ENTITY.OPPILAITOS}
    initialValues={initialValues}
    mode={FormMode.CREATE}
  >
    <OppilaitosForm organisaatioOid="1.2.246.562.10.39218317368" />
  </ReduxForm>
);
