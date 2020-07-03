import React from 'react';
import { storiesOf } from '@storybook/react';

import ValintaperusteForm from './index';
import getValintaperusteFormConfig from '#/src/utils/valintaperuste/getValintaperusteFormConfig';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

import { KOULUTUSTYYPPI } from '#/src/constants';

const config = getValintaperusteFormConfig(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS);

storiesOf('ValintaperusteForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="valintaperuste">
      {() => (
        <FormConfigContext.Provider value={config}>
          <ValintaperusteForm
            steps={false}
            organisaatioOid="1.2.246.562.10.594252633210"
            koulutustyyppi={KOULUTUSTYYPPI.YLIOPISTOKOULUTUS}
          />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  ));
