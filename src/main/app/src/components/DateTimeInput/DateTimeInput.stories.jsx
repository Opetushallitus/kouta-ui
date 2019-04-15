import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DateTimeInput from './index';

const Story = () => {
  const [date, setDate] = useState('2019-04-11T09:17');

  return (
    <DateTimeInput
      value={date}
      onChange={value => {
        action('change')(value);
        setDate(value);
      }}
    />
  );
};

storiesOf('DateTimeInput', module).add('Basic', () => <Story />);
