import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import getHakuFormConfig from '#/src/utils/haku/getHakuFormConfig';

import HakuForm, { initialValues } from './index';

const config = getHakuFormConfig();

storiesOf('HakuForm', module).add('Basic', () => (
  <ReduxForm form="hakuForm" initialValues={initialValues}>
    <FormConfigContext.Provider value={config}>
      <HakuForm organisaatioOid="1.2.246.562.10.594252633210" />
    </FormConfigContext.Provider>
  </ReduxForm>
));
