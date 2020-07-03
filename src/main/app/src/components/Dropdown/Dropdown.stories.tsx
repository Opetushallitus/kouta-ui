import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Dropdown, { DropdownMenu, DropdownMenuItem } from './index';

import Button from '#/src/components/Button';

const menu = (
  <DropdownMenu>
    <DropdownMenuItem>Item A</DropdownMenuItem>
    <DropdownMenuItem>Item B</DropdownMenuItem>
    <DropdownMenuItem>Item C</DropdownMenuItem>
  </DropdownMenu>
);

storiesOf('Dropdown', module)
  .add('Basic', () => (
    <Dropdown
      overlay={menu}
      onOutsideClick={action('outsideClick')}
      onOverlayClick={action('overlayClick')}
      open
    >
      {({ ref }) => <Button ref={ref}>Dropdown</Button>}
    </Dropdown>
  ))
  .add('With uncontrolled', () => (
    <Dropdown overlay={menu}>
      {({ ref, onToggle, open }) => (
        <Button ref={ref} onClick={onToggle}>
          Dropdown is {open ? 'open' : 'closed'}
        </Button>
      )}
    </Dropdown>
  ));
