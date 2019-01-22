import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import NativeSelect, { Option } from './index';

storiesOf('NativeSelect', module).add('Basic', () => (
  <NativeSelect value="b" onChange={action('change')}>
    <Option value="a">Option A</Option>
    <Option value="b">Option B</Option>
    <Option value="c">Option C</Option>
  </NativeSelect>
));
