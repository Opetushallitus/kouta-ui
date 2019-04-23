import React from 'react';

import FormattedInput from '../FormattedInput';
import { AddonIcon } from '../Input';

export const TimeInput = ({ pattern = ['h', 'm'], ...props }) => {
  return <FormattedInput timePattern={pattern} time {...props} addonAfter={<AddonIcon type="access_time" />} />;
};

export default TimeInput;
