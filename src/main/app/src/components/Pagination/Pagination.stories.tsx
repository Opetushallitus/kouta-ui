import React from 'react';

import { action } from '@storybook/addon-actions';

import Pagination from './index';

export default {
  title: 'Pagination',
};

export const Basic = () => (
  <Pagination onChange={action('change')} value={0} pageCount={10} />
);
