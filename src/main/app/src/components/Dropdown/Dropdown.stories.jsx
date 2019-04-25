import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Dropdown, {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from './index';

import Button from '../Button';

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
      visible
    >
      {({ ref }) => <Button ref={ref}>Dropdown</Button>}
    </Dropdown>
  ))
  .add('With uncontrolled dropdown', () => (
    <UncontrolledDropdown overlay={menu}>
      {({ ref, onToggle, visible }) => (
        <Button ref={ref} onClick={onToggle}>
          Dropdown is {visible ? 'visible' : 'hidden'}
        </Button>
      )}
    </UncontrolledDropdown>
  ));
