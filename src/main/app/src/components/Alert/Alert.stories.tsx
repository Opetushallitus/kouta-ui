import React from 'react';

import { Alert } from './index';

export default {
  title: 'Alert',
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['info', 'success', 'danger'],
      },
    },
    showIcon: { control: 'boolean' },
  },
};

export const Basic = {
  render: props => (
    <Alert title="Alert title" {...props}>
      Description
    </Alert>
  ),
};
