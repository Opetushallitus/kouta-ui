import React from 'react';
import styled, { css } from 'styled-components';
import { Spring } from 'react-spring/renderprops';

import { getThemeProp } from '#/src/theme';
import { disabledStyle } from '#/src/system';

const SwitchContainer = styled.div`
  display: inline-block;
`;

const HiddenSwitch = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledSwitch = styled.div`
  display: inline-block;
  position: relative;
  width: 2.5em;
  height: 1.25em;
  border-radius: 1em;
  border-style: solid;
  border: 0.0625em solid ${getThemeProp('colors.inputBorder')};
  background-color: rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.25s, border-color 0.25s, background-color 0.25s;

  ${HiddenSwitch}:focus + & {
    box-shadow: 0 0 0 0.1875em
      ${({ theme }) => theme.colors.primary.focusOutline};
  }

  &:hover,
  ${HiddenSwitch}:focus + & {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.danger.main : theme.colors.primary.main};
  }

  ${({ checked }) =>
    checked &&
    css`
      background-color: ${getThemeProp('palette.primary.main')};
      border-color: ${getThemeProp('palette.primary.main')};
    `}
`;

const Label = styled.label`
  font-family: ${getThemeProp('typography.fontFamily')};
  font-size: 1rem;
  display: flex;
  line-height: 1.5;
  color: ${getThemeProp('palette.text.primary')};
  align-items: center;
  cursor: pointer;

  &:hover {
    & ${StyledSwitch} {
      border-color: ${({ theme, error }) =>
        error ? theme.colors.danger.main : theme.colors.primary.main};
    }
  }

  ${disabledStyle}
`;

const LabelWrapper = styled.div`
  flex: 1;
  margin-left: 9px;

  ${disabledStyle}
`;

const SwitchWrapper = styled.div`
  flex: 0;
  line-height: 0;
`;

const SwitchBall = styled.div`
  border-radius: 50%;
  background-color: white;
  width: 1em;
  height: 1em;
  position: absolute;
  top: 0.125em;
  position: absolute;
  box-shadow: 0 0.125em 0.25em 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s;
`;

type CheckboxBaseProps = {
  disabled?: boolean;
  checked?: boolean;
  children?: React.ReactNode;
  error?: boolean;
  className?: string;
  indeterminate?: boolean;
  fullWidth?: boolean;
};

export type SwitchProps = CheckboxBaseProps &
  Omit<React.ComponentProps<typeof HiddenSwitch>, keyof CheckboxBaseProps>;

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      checked = false,
      children,
      error = false,
      disabled = false,
      ...props
    },
    ref
  ) => (
    <Label disabled={disabled}>
      <SwitchWrapper>
        <SwitchContainer className={className}>
          <HiddenSwitch
            checked={checked}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <StyledSwitch checked={checked} error={error}>
            <Spring to={{ left: checked ? '1.4em' : '0.125em' }}>
              {({ left }) => (
                <SwitchBall error={error} checked={checked} style={{ left }} />
              )}
            </Spring>
          </StyledSwitch>
        </SwitchContainer>
      </SwitchWrapper>
      {children ? <LabelWrapper>{children}</LabelWrapper> : null}
    </Label>
  )
);

export default Switch;
