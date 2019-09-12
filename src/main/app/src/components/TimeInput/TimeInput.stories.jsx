import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TimeInput from './index';

const Story = () => {
  const [value, setValue] = useState('01:30');

  return (
    <TimeInput
      value={value}
      onChange={time => {
        action('change')(time);
        setValue(time);
      }}
    />
  );
};

storiesOf('TimeInput', module).add('Basic', () => <Story />);
