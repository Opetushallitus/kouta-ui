import React from 'react';
import TimeField from 'react-simple-timefield';

import Input from '#/src/components/Input';
import InputIcon from '#/src/components/InputIcon';

export const TimeInput = ({
  colon = ':',
  showSeconds = false,
  error = false,
  disabled = false,
  id,
  inputProps = {},
  onChange,
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
      onChange={(e, value) => onChange(value)}
      {...props}
    />
  );
};

export default TimeInput;
