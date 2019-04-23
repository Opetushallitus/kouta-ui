import React from 'react';
import { storiesOf } from '@storybook/react';

import Input, { AddonIcon } from './index';

storiesOf('Input', module)
  .add('Basic', () => <Input />)
  .add('With disabled', () => <Input disabled />)
  .add('With error', () => <Input error />)
  .add('With addon', () => (
    <Input addonAfter={<AddonIcon type="access_time" />} />
  ));
