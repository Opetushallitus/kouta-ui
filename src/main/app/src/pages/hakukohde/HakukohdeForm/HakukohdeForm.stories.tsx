import React from 'react';
import { storiesOf } from '@storybook/react';

import HakukohdeForm from './index';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import getHakukohdeFormConfig from '#/src/utils/hakukohde/getHakukohdeFormConfig';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';
import { KOULUTUSTYYPPI } from '#/src/constants';

const config = getHakukohdeFormConfig(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS);

storiesOf('HakukohdeForm', module)
  .addDecorator(makeLocalizationDecorator())
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
