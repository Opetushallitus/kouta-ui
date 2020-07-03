import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DateTimeInput from './index';
import { makeLocalizationDecorator } from '#/src/storybookUtils';

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

storiesOf('DateTimeInput', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <Story />);
