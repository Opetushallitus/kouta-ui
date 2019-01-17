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

const listOfKeys = [{label: 'Option A', key: 'a'}];

storiesOf('DropdownCheckbox', module)
  .add('Basic', () => (
    <DropdownCheckbox options={list} onChange={action('change')} value={listOfKeys}>
    </DropdownCheckbox>
  ));
