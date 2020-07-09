import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { makeLocalizationDecorator } from '#/src/storybookUtils';
import Select, { CreatableSelect } from './index';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

storiesOf('Select', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <Select options={options} onChange={action('change')} />)
  .add('With error', () => (
    <Select options={options} onChange={action('change')} error />
  ))
  .add('With CreatableSelect', () => (
    <CreatableSelect isClearable isMulti onChange={action('change')} />
  ));
