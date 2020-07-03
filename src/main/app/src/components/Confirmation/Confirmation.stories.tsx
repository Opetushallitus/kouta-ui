import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from '#/src/components/Button';

import Confirmation from './index';

storiesOf('Confirmation', module).add('Basic', () => (
  <Confirmation onConfirm={action('confirm')}>
    {({ onToggle, ref }) => (
      <div onClick={onToggle} ref={ref}>
        <Button>Poista</Button>
      </div>
    )}
  </Confirmation>
));
