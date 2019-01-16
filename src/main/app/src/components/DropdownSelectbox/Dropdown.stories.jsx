import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions/dist/preview';
import { DropdownCheckbox } from './index';

const list = [
  {label: 'Option A', key: 'a'},
  {label: 'Option B', key: 'b'},
  {label: 'Option C', key: 'c'},
  {label: 'Option D', key: 'd'}
];

storiesOf('DropdownSelectbox', module)
  .add('Basic', () => (
    <DropdownCheckbox options={list}>
    </DropdownCheckbox>
  ));
