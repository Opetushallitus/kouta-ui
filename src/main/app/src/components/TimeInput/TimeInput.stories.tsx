import React, { useState } from 'react';

import { action } from 'storybook/actions';

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

export default {
  title: 'TimeInput',
};

export const Basic = () => <Story />;
