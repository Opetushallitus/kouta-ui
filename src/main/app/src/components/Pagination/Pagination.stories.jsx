import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Pagination from './index';

storiesOf('Pagination', module).add('Basic', () => (
  <Pagination onChange={action('change')} value={0} pageCount={10} />
));
