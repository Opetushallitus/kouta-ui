import React from 'react';
import { storiesOf } from '@storybook/react';

import Input from './index';
import InputIcon from '../InputIcon';

storiesOf('Input', module)
  .add('Basic', () => <Input />)
  .add('With disabled', () => <Input disabled />)
  .add('With error', () => <Input error />)
  .add('With addon', () => (
    <Input suffix={<InputIcon type="access_time" />} />
  ));
