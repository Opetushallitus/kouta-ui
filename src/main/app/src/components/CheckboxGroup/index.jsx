import React from 'react';
import styled from 'styled-components';

import Checkbox from '../Checkbox';
import { isArray } from '../../utils';

const CheckboxContainer = styled.div`
  ${({ isLast }) => !isLast && { marginBottom: '4px' }}
`;

const cleanValue = (value, options) => {
  const optionValues = options.map(({ value }) => value);

  if (!isArray(options) || !isArray(value)) {
    return value;
  }

  return value.filter(v => optionValues.includes(v));
};

const makeOnCheckboxChange = ({
  value,
  onChange,
  optionValue,
  options,
}) => e => {
  if (e.target.checked) {
    onChange(cleanValue([...value, optionValue], options));
  } else {
    onChange(cleanValue(value.filter(v => v !== optionValue), options));
  }
};

const CheckboxGroup = ({
  value = [],
  onChange,
  options = [],
  error = false,
  disabled = false,
}) => {
  return options.map(({ value: optionValue, label }, index) => (
    <CheckboxContainer key={optionValue} isLast={index === options.length - 1}>
      <Checkbox
        checked={value.includes(optionValue)}
        onChange={makeOnCheckboxChange({
          value,
          onChange,
          optionValue,
          options,
        })}
        disabled={disabled}
        name={optionValue}
        error={error}
      >
        {label}
      </Checkbox>
    </CheckboxContainer>
  ));
};

export default CheckboxGroup;
