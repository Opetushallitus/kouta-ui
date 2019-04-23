import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TimeInput from './index';

const Story = () => {
  const [value, setValue] = useState('01:30');

  return <TimeInput value={value} onChange={e => {
    action('change')(e);
    setValue(e.target.value)
  }} />;
};

storiesOf('TimeInput', module).add('Basic', () => <Story />);
