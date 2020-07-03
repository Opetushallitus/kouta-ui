import React from 'react';
import { storiesOf } from '@storybook/react';

import HakuForm from './index';
import ReduxForm from '#/src/components/ReduxForm';
import getHakuFormConfig from '#/src/utils/haku/getHakuFormConfig';
import FormConfigContext from '#/src/contexts/FormConfigContext';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

const config = getHakuFormConfig();

storiesOf('HakuForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="hakuForm">
      {() => (
        <FormConfigContext.Provider value={config}>
          <HakuForm organisaatioOid="1.2.246.562.10.594252633210" />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  ));
