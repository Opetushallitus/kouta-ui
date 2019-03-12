import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';
import { isArray } from '../../utils';

const Label = styled.label`
  font-family: ${getThemeProp('typography.fontFamily')};
  font-size: 1rem;
  display: flex;
  line-height: 1.5;
  color: ${getThemeProp('palette.text.primary')};
`;

const RadioContainer = styled.div`
  ${({ last }) =>
    !last &&
    css`
      margin-bottom: ${({ theme }) => theme.spacing.unit * 0.5}px;
    `}
`;

const LabelWrapper = styled.div`
  flex: 1;
  margin-left: 6px;
`;

const RadioWrapper = styled.div`
  flex: 0;
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  font-size: inherit;
`;

export const Radio = ({ children = null, ...props }) => (
  <Label>
    <RadioWrapper>
      <RadioInput type="radio" {...props} />
    </RadioWrapper>
    <LabelWrapper>{children}</LabelWrapper>
  </Label>
);

export const RadioGroup = ({
  value,
  onChange,
  disabled = false,
  options,
  ...props
}) => {
  let children = null;

  if (props.children) {
    const childrenCount = React.Children.count(props.children);

    children = React.Children.map(props.children, (child, index) => {
      const checked = value !== undefined && child.props.value === value;
      const element = React.cloneElement(child, {
        checked,
        onChange,
        disabled,
      });
      const last = index === childrenCount - 1;

      return <RadioContainer last={last}>{element}</RadioContainer>;
    });
  } else if (isArray(options)) {
    children = options.map(({ value: optionValue, label }, index) => (
      <RadioContainer last={index === options.length - 1}>
        <Radio checked={value !== undefined && value === optionValue} onChange={onChange} value={optionValue}>
          {label}
        </Radio>
      </RadioContainer>
    ));
  }

  return <div {...props}>{children}</div>;
};

export default Radio;
