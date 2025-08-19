import React from 'react';

import { action } from 'storybook/actions';

import ErrorAlert from './index';

export default {
  title: 'ErrorAlert',
};

export const Basic = () => <ErrorAlert onReload={action('reload')} />;

export const WithCenter = {
  render: () => <ErrorAlert onReload={action('reload')} center />,

  name: 'With center',
};
