import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';
import { isArray } from '../../utils';
import { disabledStyle } from '../../system';

const RadioContainer = styled.div`
  ${({ last }) =>
    !last &&
    css`
      margin-bottom: 4px;
    `}
`;

const Icon = styled.svg`
  background-color: white;
  border-radius: 50%;
  width: 0.4em;
  height: 0.4em;
`;
const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledRadio = styled.div`
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: white;
  border-radius: 50%;
  border: 1px solid ${getThemeProp('palette.border')};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0), inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.25s, border-color 0.25s, background-color 0.25s;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;

  ${HiddenRadio}:focus + & {
    border-color: ${getThemeProp('palette.primary.main')};
    box-shadow: 0 0 0 1px ${getThemeProp('palette.primary.main')};
  }

  ${({ checked }) =>
    checked &&
    css`
      background-color: ${getThemeProp('palette.primary.main')};
      border-color: ${getThemeProp('palette.primary.main')};
    `}

  ${({ error }) =>
    error &&
    css`
      border-color: ${getThemeProp('palette.danger.main')};
    `}

  ${Icon} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')};
  }
`;

const Label = styled.label`
  font-family: ${getThemeProp('typography.fontFamily')};
  font-size: 1rem;
  display: flex;
  line-height: 1.5;
  color: ${getThemeProp('palette.text.primary')};

  ${disabledStyle}
`;

const LabelWrapper = styled.div`
  flex: 1;
  margin-left: 9px;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

const RadioWrapper = styled.div`
  flex: 0;
  line-height: 0;
  position: relative;
  top: 0.15em;
`;

export const Radio = ({
  className,
  checked,
  children,
  error = false,
  disabled = false,
  ...props
}) => (
  <Label disabled={disabled}>
    <RadioWrapper>
      <HiddenRadio checked={checked} disabled={disabled} {...props} />
      <StyledRadio checked={checked} error={error}>
        <Icon />
      </StyledRadio>
    </RadioWrapper>
    <LabelWrapper>{children}</LabelWrapper>
  </Label>
);

export const RadioGroup = ({
  value,
  onChange,
  disabled = false,
  options,
  error = false,
  ...props
}) => {
  let children = null;

  if (props.children) {
    const validChildren = React.Children.toArray(props.children).filter(c =>
      React.isValidElement(c),
    );

    const childrenCount = React.Children.count(validChildren);

    children = React.Children.map(validChildren, (child, index) => {
      const checked = value !== undefined && child.props.value === value;
      const element = React.cloneElement(child, {
        checked,
        onChange,
        disabled,
        error,
      });
      const last = index === childrenCount - 1;

      return <RadioContainer last={last}>{element}</RadioContainer>;
    });
  } else if (isArray(options)) {
    children = options.map(({ value: optionValue, label }, index) => (
      <RadioContainer last={index === options.length - 1} key={optionValue}>
        <Radio
          checked={value !== undefined && value === optionValue}
          onChange={onChange}
          value={optionValue}
          error={error}
        >
          {label}
        </Radio>
      </RadioContainer>
    ));
  }

  return <div {...props}>{children}</div>;
};

export default Radio;
