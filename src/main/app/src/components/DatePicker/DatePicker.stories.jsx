import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DatePicker, { DatePickerInput } from './index';
import { makeLocalisationDecorator } from '../../storybookUtils';

const Story = () => {
  const [date, setDate] = useState(undefined);

  return (
    <DatePickerInput
      value={date}
      onChange={value => {
        action('change')(value);
        setDate(value);
      }}
    />
  );
};

storiesOf('DatePicker', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => <DatePicker value={new Date()} />)
  .add('With DayPickerInput', () => <Story />);
