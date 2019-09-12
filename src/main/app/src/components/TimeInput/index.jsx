import React from 'react';

import Input from '../Input';
import InputIcon from '../InputIcon';
import TimeField from 'react-simple-timefield';

export const TimeInput = ({
  colon = ':',
  showSeconds = false,
  error = false,
  disabled = false,
  id,
  inputProps = {},
  ...props
}) => {
  return (
    <TimeField
      input={
        <Input
          suffix={<InputIcon type="access_time" />}
          error={error}
          disabled={disabled}
          id={id}
        />
      }
      colon={colon}
      showSeconds={showSeconds}
      {...props}
    />
  );
};

export default TimeInput;
