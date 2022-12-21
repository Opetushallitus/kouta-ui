import React from 'react';

import _fp from 'lodash/fp';

import { Input, InputProps } from '#/src/components/virkailija';
import { parseFloatComma } from '#/src/utils';

type NumberInputProps = {
  min?: number;
  max?: number;
  fallbackValue?: number | null;
  onBlur?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
  parseValue?: (value: string) => number | null;
} & InputProps;

const floatToCommaStr = (value?: number | null) =>
  _fp.isNil(value) ? '' : _fp.toString(value).replace('.', ',');

const NumberInput = ({
  onBlur = _fp.noop,
  min = 0,
  max,
  fallbackValue = null,
  parseValue = _fp.identity,
  ...props
}: NumberInputProps) => {
  const usedOnBlur = e => {
    const value: string = e?.target?.value;
    const floatValue = parseValue(value);
    if (_fp.isNaN(floatValue) || _fp.isNil(floatValue)) {
      e.target.value = fallbackValue;
    } else {
      if (_fp.isNumber(max) && floatValue > max) {
        e.target.value = max;
      } else if (_fp.isNumber(min) && floatValue < min) {
        e.target.value = min;
      } else {
        e.target.value = floatToCommaStr(floatValue);
      }
    }
    onBlur(e);
  };

  return <Input type="number" onBlur={usedOnBlur} {...props} />;
};

export const IntegerInput = ({
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  fallbackValue = 0,
  ...props
}: Omit<NumberInputProps, 'parseValue'>) => (
  <NumberInput
    min={min}
    max={max}
    fallbackValue={fallbackValue}
    parseValue={value => Number.parseInt(value, 10)}
    {...props}
  />
);

type FloatInputProps = Omit<NumberInputProps, 'parseValue'> & {
  decimals?: number;
};

export const FloatInput = ({
  min = 0,
  decimals,
  ...props
}: FloatInputProps) => (
  <NumberInput
    min={min}
    parseValue={n => parseFloatComma(n, decimals)}
    {...props}
  />
);
