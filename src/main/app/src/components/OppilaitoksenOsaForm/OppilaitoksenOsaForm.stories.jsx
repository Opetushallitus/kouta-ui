import React from 'react';
import { storiesOf } from '@storybook/react';

import OppilaitoksenOsaForm from './index';
import ReduxForm from '../ReduxForm';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

storiesOf('OppilaitoksenOsaForm', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="oppilaitoksenOsaForm">
      {() => <OppilaitoksenOsaForm organisaatioOid="1.2.246.562.10.94639300915" />}
    </ReduxForm>
  ));
