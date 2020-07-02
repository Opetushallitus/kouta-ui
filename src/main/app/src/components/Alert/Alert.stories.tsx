import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, boolean } from '@storybook/addon-knobs';

import Alert from './index';

storiesOf('Alert', module).add('Basic', () => {
  const variant = select(
    'Variant',
    {
      Info: 'info',
      Success: 'success',
      Danger: 'danger',
    },
    'info'
  );

  const showIcon = boolean('Show icon', true);

  return (
    <Alert variant={variant} showIcon={showIcon} title="Alert title">
      Description
    </Alert>
  );
});
