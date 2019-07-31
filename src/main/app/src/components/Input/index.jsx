import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';
import Icon from '../Icon';
import { disabledStyle } from '../../system';

export const AddonIcon = styled(Icon)`
  font-size: 1.25rem;
  color: ${getThemeProp('palette.text.secondary')};
`;

export const InputContainer = styled.div`
  position: relative;
`;

export const AddonContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;

  ${({ isAfter }) =>
    isAfter &&
    css`
      right: 12px;
    `};
`;

export const InputBase = styled.input`
  border: 1px solid ${getThemeProp('palette.border')};
  color: ${getThemeProp('palette.text.primary')};
  font-family: ${getThemeProp('typography.fontFamily')};
  line-height: 1.5;
  border-radius: 2px;
  outline: none;
  padding: 6px 12px;
  font-size: 1rem;
  transition: border-color 0.25s, box-shadow 0.25s;
  display: block;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: ${getThemeProp('palette.primary.main')};
    box-shadow: 0 0 0 1px ${getThemeProp('palette.primary.main')};
  }

  ${({ error }) =>
    error &&
    css`
      border-color: ${getThemeProp('palette.danger.main')};

      &:focus {
        border-color: ${getThemeProp('palette.danger.main')};
        box-shadow: 0 0 0 1px ${getThemeProp('palette.danger.main')};
      }
    `}

  ${disabledStyle}
  
  ${({ hasAddonBefore }) => hasAddonBefore && css`
      padding-left: 40px;
  `}

  ${({ hasAddonAfter }) => hasAddonAfter && css`
      padding-right: 40px;
  `}
`;

export default React.forwardRef(
  ({ addonBefore = null, addonAfter = null, ...props }, ref) => {
    const hasAddonBefore = !!addonBefore;
    const hasAddonAfter = !!addonAfter;

    return (
      <InputContainer>
        {hasAddonBefore ? (
          <AddonContainer isBefore>{addonBefore}</AddonContainer>
        ) : null}
        <InputBase
          ref={ref}
          {...props}
          hasAddonBefore={hasAddonBefore}
          hasAddonAfter={hasAddonAfter}
        />
        {hasAddonAfter ? (
          <AddonContainer isAfter>{addonAfter}</AddonContainer>
        ) : null}
      </InputContainer>
    );
  },
);
