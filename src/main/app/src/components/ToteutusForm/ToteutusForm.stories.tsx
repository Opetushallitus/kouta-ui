import React from 'react';
import { storiesOf } from '@storybook/react';

import ToteutusForm from './index';
import ReduxForm from '../ReduxForm';
import FormConfigContext from '../FormConfigContext';
import getToteutusFormConfig from '../../utils/getToteutusFormConfig';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';
import { KOULUTUSTYYPPI } from '../../constants';

const config = getToteutusFormConfig(KOULUTUSTYYPPI.TUTKINNON_OSA);

storiesOf('ToteutusForm', module)
  .addDecorator(makeLocalisationDecorator())
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
