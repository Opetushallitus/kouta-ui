import React from 'react';
import { storiesOf } from '@storybook/react';

import ValintaperusteForm from './index';
import getValintaperusteFormConfig from '../../utils/getValintaperusteFormConfig';
import ReduxForm from '../ReduxForm';
import FormConfigContext from '../FormConfigContext';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

import { KOULUTUSTYYPPI } from '../../constants';

const config = getValintaperusteFormConfig(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS);

storiesOf('ValintaperusteForm', module)
  .addDecorator(makeLocalisationDecorator())
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
