import React from 'react';
import styled, { css } from 'styled-components';
import { Spring } from 'react-spring';

import { getThemeProp } from '../../theme';
import { disabledStyle } from '../../system';

const SwitchContainer = styled.div`
  display: inline-block;
`;

const HiddenSwitch = styled.input.attrs({ type: 'Switch' })`
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

const StyledSwitch = styled.div`
  display: inline-block;
  position: relative;
  width: 2.5em;
  height: 1.2em;
  border-radius: 1em;
  background-color: rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.25s, border-color 0.25s, background-color 0.25s;

  ${HiddenSwitch}:focus + & {
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
  top: 0.1em;
  position: absolute;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s;
`;

const Switch = ({
  className,
  checked,
  children,
  error = false,
  disabled = false,
  ...props
}) => (
  <Label disabled={disabled}>
    <SwitchWrapper>
      <SwitchContainer className={className}>
        <HiddenSwitch checked={checked} disabled={disabled} {...props} />
        <StyledSwitch checked={checked} error={error}>
          <Spring to={{ left: checked ? '1.3em' : '0.1em' }}>
            {({ left }) => (
              <SwitchBall error={error} checked={checked} style={{ left }} />
            )}
          </Spring>
        </StyledSwitch>
      </SwitchContainer>
    </SwitchWrapper>
    {children ? <LabelWrapper>{children}</LabelWrapper> : null}
  </Label>
);

export default Switch;
