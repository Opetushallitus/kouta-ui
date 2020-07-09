import React from 'react';
import { storiesOf } from '@storybook/react';

import OppilaitoksenOsaForm from './index';
import ReduxForm from '#/src/components/ReduxForm';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

storiesOf('OppilaitoksenOsaForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="oppilaitoksenOsaForm">
      {() => (
        <OppilaitoksenOsaForm organisaatioOid="1.2.246.562.10.94639300915" />
      )}
    </ReduxForm>
  ));
