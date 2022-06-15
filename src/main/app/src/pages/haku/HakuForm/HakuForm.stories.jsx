import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode } from '#/src/constants';

import HakuForm, { initialValues } from './index';

storiesOf('HakuForm', module).add('Basic', () => (
  <ReduxForm
    form={ENTITY.HAKU}
    initialValues={initialValues}
    mode={FormMode.CREATE}
  >
    <HakuForm organisaatioOid="1.2.246.562.10.594252633210" />
  </ReduxForm>
));
