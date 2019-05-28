import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import Alert from './index';

storiesOf('Alert', module).add('Basic', () => {
  const variant = select(
    'Variant',
    {
      Info: 'info',
      Success: 'success',
      Danger: 'danger',
    },
    'contained',
  );

  return (
    <Alert
      variant={variant}
      message="Alert message"
      description="Alert description"
    />
  );
});
