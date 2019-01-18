import React from 'react';

import Checkbox from '../Checkbox';

const makeOnCheckboxChange = ({ value, onChange, optionValue }) => e => {
  if (e.target.checked) {
    onChange([...value, optionValue]);
  } else {
    onChange(value.filter(v => v !== optionValue));
  }
};

const CheckboxGroup = ({ value = [], onChange, options = [] }) => {
  return options.map(({ value: optionValue, label }) => (
    <Checkbox
      key={optionValue}
      checked={value.includes(optionValue)}
      onChange={makeOnCheckboxChange({ value, onChange, optionValue })}
    >
      {label}
    </Checkbox>
  ));
};

export default CheckboxGroup;
