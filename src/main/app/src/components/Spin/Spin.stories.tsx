import React from 'react';
import { storiesOf } from '@storybook/react';

import Spin from './index';

storiesOf('Spin', module)
  .add('Basic', () => <Spin />)
  .add('With size', () => (
    <>
      <Spin size="small" />
      <Spin size="medium" />
      <Spin size="large" />
    </>
  ))
  .add('With center', () => (
    <>
      <Spin center />
    </>
  ));
