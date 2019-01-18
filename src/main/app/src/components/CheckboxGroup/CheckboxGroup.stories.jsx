import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CheckboxGroup from './index';

const options = [
  {
    label: 'Checkbox 1',
    value: '1',
  },
  {
    label: 'Checkbox 2',
    value: '2',
  },
  {
    label: 'Checkbox 3',
    value: '3',
  },
];

storiesOf('CheckboxGroup', module).add('Basic', () => (
  <CheckboxGroup value={['1']} options={options} onChange={action('change')} />
));
