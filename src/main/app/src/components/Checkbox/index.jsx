import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';

const CheckboxContainer = styled.div`
  display: inline-block;
  position: relative;
  top: 0.15em;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
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

const StyledCheckbox = styled.div`
  display: inline-block;
  position: relative;
  width: 1em;
  height: 1em;
  background-color: white;
  border: 1px solid ${getThemeProp('palette.border')};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0), inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  transition: box-shadow 0.25s, border-color 0.25s, background-color 0.25s;

  ${HiddenCheckbox}:focus + & {
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
  align-items: flex-start;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
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

const CheckboxWrapper = styled.div`
  flex: 0;
  line-height: 0;
`;

const IndeterminateIndicator = styled.div`
  top: 50%;
  left: 50%;
  width: 0.5em;
  height: 0.5em;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 2px;
  position: absolute;
  transform: translate(-50%, -50%);
`;

const Checkbox = ({
  className,
  checked,
  children,
  error = false,
  disabled = false,
  indeterminate = false,
  ...props
}) => (
  <Label disabled={disabled}>
    <CheckboxWrapper>
      <CheckboxContainer className={className}>
        <HiddenCheckbox checked={checked} disabled={disabled} {...props} />
        <StyledCheckbox
          checked={checked}
          indeterminate={indeterminate}
          error={error}
        >
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
          {indeterminate && !checked ? <IndeterminateIndicator /> : null}
        </StyledCheckbox>
      </CheckboxContainer>
    </CheckboxWrapper>
    <LabelWrapper>{children}</LabelWrapper>
  </Label>
);

export default Checkbox;
