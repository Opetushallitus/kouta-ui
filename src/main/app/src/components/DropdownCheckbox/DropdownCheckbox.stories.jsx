import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions/dist/preview';
import { DropdownCheckbox, DropdownCheckbox2, SelectBase } from './index';

const list = [
  {label: 'Option A', key: 'a'},
  {label: 'Option B', key: 'b'},
  {label: 'Option C', key: 'c'},
  {label: 'Option D', key: 'd'}
];

const listOfKeys = [{label: 'Option A', key: 'a'}];

storiesOf('DropdownCheckbox', module)
  .add('Basic', () => (
    <DropdownCheckbox overlay={list} onChange={action('change')} value={listOfKeys}>
    {({ ref, onToggle }) => (
        <SelectBase ref={ref} onClick={onToggle}/>
      )}
    </DropdownCheckbox>
  ));
