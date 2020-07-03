import React from 'react';
import { storiesOf } from '@storybook/react';

import OppilaitosForm from './index';
import ReduxForm from '#/src/components/ReduxForm';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

storiesOf('OppilaitosForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator({ logging: true }))
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="oppilaitosForm">
      {() => <OppilaitosForm organisaatioOid="1.2.246.562.10.39218317368" />}
    </ReduxForm>
  ));
