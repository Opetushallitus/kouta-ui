import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Pagination from './index';
import { makeLocalisationDecorator } from '../../storybookUtils';

storiesOf('Pagination', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => (
    <Pagination onChange={action('change')} value={0} pageCount={10} />
  ));
