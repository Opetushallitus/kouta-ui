import React from 'react';
import { storiesOf } from '@storybook/react';

import HaunKohdejoukkoFields from './index';
import ReduxForm from '#/src/components/ReduxForm';

import {
  makeApiDecorator,
  makeLocalizationDecorator,
  makeStoreDecorator,
} from '#/src/storybookUtils';

storiesOf('HaunKohdejoukkoFields', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="form">
      {() => <HaunKohdejoukkoFields name="kohdejoukko" />}
    </ReduxForm>
  ));
