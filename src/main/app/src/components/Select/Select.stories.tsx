import React from 'react';

import { action } from '@storybook/addon-actions';

import Select, { CreatableSelect } from './index';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

export default {
  title: 'Select',
};

export const Basic = () => (
  <Select options={options} onChange={action('change')} />
);

export const WithError = () => (
  <Select options={options} onChange={action('change')} error />
);

WithError.storyName = 'With error';

export const WithCreatableSelect = () => (
  <CreatableSelect isClearable isMulti onChange={action('change')} />
);

WithCreatableSelect.storyName = 'With CreatableSelect';
