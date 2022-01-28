import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { FormMode } from '#/src/constants';

import OppilaitosForm, { initialValues } from './index';

storiesOf('OppilaitosForm', module).add('Basic', () => (
  <ReduxForm
    form="oppilaitosForm"
    initialValues={initialValues}
    mode={FormMode.CREATE}
  >
    <OppilaitosForm organisaatioOid="1.2.246.562.10.39218317368" />
  </ReduxForm>
));
