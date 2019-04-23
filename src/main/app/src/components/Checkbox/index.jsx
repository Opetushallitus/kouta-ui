import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';

const Label = styled.label`
  font-family: ${getThemeProp('typography.fontFamily')};
  font-size: 1rem;
  display: flex;
  line-height: 1.5;
  color: ${getThemeProp('palette.text.primary')};
  align-items: center;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}
`;

const LabelWrapper = styled.div`
  flex: 1;
  margin-left: 6px;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

const CheckboxWrapper = styled.div`
  flex: 0;
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  font-size: inherit;
`;

const Checkbox = ({ children = null, disabled = false, ...props }) => {
  return (
    <Label disabled={disabled}>
      <CheckboxWrapper>
        <CheckboxInput disabled={disabled} {...props} />
      </CheckboxWrapper>
      <LabelWrapper disabled={disabled}>{children}</LabelWrapper>
    </Label>
  );
};

export default Checkbox;
