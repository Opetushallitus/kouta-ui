import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Pagination from './index';
import { makeLocalizationDecorator } from '#/src/storybookUtils';

storiesOf('Pagination', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => (
    <Pagination onChange={action('change')} value={0} pageCount={10} />
  ));
