import React from 'react';
import { storiesOf } from '@storybook/react';

import HakuForm from './index';
import ReduxForm from '../ReduxForm';
import getHakuFormConfig from '../../utils/getHakuFormConfig';
import FormConfigContext from '../FormConfigContext';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

const config = getHakuFormConfig();

storiesOf('HakuForm', module)
  .addDecorator(makeLocalisationDecorator())
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
