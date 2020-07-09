import React from 'react';
import { storiesOf } from '@storybook/react';

import ToteutusForm from './index';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import getToteutusFormConfig from '#/src/utils/toteutus/getToteutusFormConfig';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';
import { KOULUTUSTYYPPI } from '#/src/constants';

const config = getToteutusFormConfig(KOULUTUSTYYPPI.TUTKINNON_OSA);

storiesOf('ToteutusForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="toteutus">
      {() => (
        <FormConfigContext.Provider value={config}>
          <ToteutusForm
            koulutusKoodiUri="koulutus_361101#11"
            organisaatioOid="1.2.246.562.10.594252633210"
            steps={false}
            koulutustyyppi={KOULUTUSTYYPPI.TUTKINNON_OSA}
          />
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  ));
