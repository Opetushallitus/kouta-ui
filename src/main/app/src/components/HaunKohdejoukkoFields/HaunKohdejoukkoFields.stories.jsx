import React from 'react';
import { storiesOf } from '@storybook/react';

import HaunKohdejoukkoFields from './index';
import ReduxForm from '../ReduxForm';

import {
  makeApiDecorator,
  makeLocalisationDecorator,
  makeStoreDecorator,
} from '../../storybookUtils';

storiesOf('HaunKohdejoukkoFields', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="form">
      {() => <HaunKohdejoukkoFields name="kohdejoukko" />}
    </ReduxForm>
  ));
