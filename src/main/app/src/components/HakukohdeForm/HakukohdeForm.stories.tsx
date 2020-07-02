import React from 'react';
import { storiesOf } from '@storybook/react';

import HakukohdeForm from './index';
import ReduxForm from '../ReduxForm';
import FormConfigContext from '../FormConfigContext';
import getHakukohdeFormConfig from '../../utils/getHakukohdeFormConfig';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';
import { KOULUTUSTYYPPI } from '../../constants';

const config = getHakukohdeFormConfig(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS);

storiesOf('HakukohdeForm', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeStoreDecorator({ logging: true }))
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="hakukohde">
      {() => (
        <FormConfigContext.Provider value={config}>
          <HakukohdeForm
            steps={false}
            organisaatioOid="1.2.246.562.10.594252633210"
            koulutustyyppi={KOULUTUSTYYPPI.YLIOPISTOKOULUTUS}
          />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  ));
