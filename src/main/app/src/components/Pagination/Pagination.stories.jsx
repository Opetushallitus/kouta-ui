import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { makeLocalizationDecorator } from '#/src/storybookUtils';

import Pagination from './index';

storiesOf('Pagination', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => (
    <Pagination onChange={action('change')} value={0} pageCount={10} />
  ));
