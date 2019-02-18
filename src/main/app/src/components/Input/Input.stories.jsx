import React from 'react';
import { storiesOf } from '@storybook/react';

import Input from './index';

storiesOf('Input', module)
  .add('Basic', () => <Input />)
  .add('With disabled', () => <Input disabled />)
  .add('With invalid', () => <Input invalid />);
