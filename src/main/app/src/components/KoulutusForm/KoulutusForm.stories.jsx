import React from 'react';
import { storiesOf } from '@storybook/react';

import KoulutusForm from './index';
import ReduxForm from '../ReduxForm';
import getKoulutusFormConfig from '../../utils/getKoulutusFormConfig';
import FormConfigContext from '../FormConfigContext';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

const config = getKoulutusFormConfig();

storiesOf('KoulutusForm', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => {
    return (
      <ReduxForm form="koulutus">
        {() => (
          <FormConfigContext.Provider value={config}>
            <KoulutusForm
              organisaatioOid="1.2.246.562.10.594252633210"
              steps={false}
            />
          </FormConfigContext.Provider>
        )}
      </ReduxForm>
    );
  });
