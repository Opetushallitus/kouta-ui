import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Select, { CreatableSelect } from './index';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

storiesOf('Select', module)
  .add('Basic', () => <Select options={options} onChange={action('change')} />)
  .add('With CreatableSelect', () => (
    <CreatableSelect isClearable isMulti onChange={action('change')} />
  ));
