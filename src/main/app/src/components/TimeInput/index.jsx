import React from 'react';

import FormattedInput from '../FormattedInput';
import InputIcon from '../InputIcon';

export const TimeInput = ({ pattern = ['h', 'm'], ...props }) => {
  return <FormattedInput timePattern={pattern} time {...props} suffix={<InputIcon type="access_time" />} />;
};

export default TimeInput;
