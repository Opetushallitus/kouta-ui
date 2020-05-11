import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, boolean } from '@storybook/addon-knobs';

import Button from './index';

storiesOf('Button', module).add('Basic', () => {
  const variant = select(
    'Variant',
    {
      Contained: 'contained',
      Outlined: 'outlined',
      Text: 'text',
    },
    'contained'
  );

  const color = select(
    'Color',
    {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
    },
    'primary'
  );

  const size = select(
    'Size',
    {
      Small: 'small',
      Medium: 'medium',
    },
    'medium'
  );

  const disabled = boolean('Disabled', false);

  return (
    <Button variant={variant} color={color} size={size} disabled={disabled}>
      Button
    </Button>
  );
});
