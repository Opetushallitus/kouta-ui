import React from 'react';

import _fp from 'lodash/fp';

import { Input, InputProps } from '#/src/components/virkailija';

type IntegerInputProps = {
  min?: number;
  max?: number;
  fallbackValue?: number;
  onBlur?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
} & InputProps;

export const IntegerInput = ({
  onBlur = _fp.noop,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  fallbackValue = 0,
  ...props
}: IntegerInputProps) => {
  const usedOnBlur = e => {
    const value: string = e?.target?.value;
    const intValue = Number.parseInt(value, 10);
    if (_fp.isNaN(intValue)) {
      e.target.value = fallbackValue;
    } else {
      if (intValue > max) {
        e.target.value = max;
      } else if (intValue < min) {
        e.target.value = min;
      } else {
        e.target.value = intValue;
      }
    }
    onBlur(e);
  };

  return <Input type="number" onBlur={usedOnBlur} {...props} />;
};
