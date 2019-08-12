import React from 'react';
import { storiesOf } from '@storybook/react';

import OppilaitosForm from './index';
import ReduxForm from '../ReduxForm';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

storiesOf('OppilaitosForm', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="oppilaitosForm">
      {() => <OppilaitosForm organisaatioOid="1.2.246.562.10.39218317368" />}
    </ReduxForm>
  ));
