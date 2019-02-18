import React from 'react';

import Checkbox from '../Checkbox';
import { isArray } from '../../utils';

const cleanValue = (value, options) => {
  const optionValues = options.map(({ value }) => value);

  if (!isArray(options) || !isArray(value)) {
    return value;
  }

  return value.filter(v => optionValues.includes(v));
};

const makeOnCheckboxChange = ({ value, onChange, optionValue, options }) => e => {
  if (e.target.checked) {
    onChange(cleanValue([...value, optionValue], options));
  } else {
    onChange(cleanValue(value.filter(v => v !== optionValue), options));
  }
};

const CheckboxGroup = ({ value = [], onChange, options = [], disabled = false }) => {
  return options.map(({ value: optionValue, label }) => (
    <Checkbox
      key={optionValue}
      checked={value.includes(optionValue)}
      onChange={makeOnCheckboxChange({ value, onChange, optionValue, options })}
      disabled={disabled}
    >
      {label}
    </Checkbox>
  ));
};

export default CheckboxGroup;
