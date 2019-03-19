import React from 'react';
import { darken } from 'polished';
import styled, { css } from 'styled-components';
import get from 'lodash/get';

import { getThemeProp } from '../../theme';

const getOutlinedColorCss = ({ color, theme }) => {
  const outlineColor =
    get(theme, ['palette', color, 'main']) || theme.palette.primary.main;

  return `
    border-color: ${outlineColor};
    color: ${outlineColor};

    &:hover {
      border-color: ${darken(0.05, outlineColor)};
      color: ${darken(0.05, outlineColor)};
    }

    &:active {
      border-color: ${darken(0.1, outlineColor)};
      color: ${darken(0.1, outlineColor)};
    }
  `;
};

const getContainedColorCss = ({ color, theme }) => {
  const fontColor =
    get(theme, ['palette', color, 'contrastText']) ||
    theme.palette.primary.contrastText;
  const containColor =
    get(theme, ['palette', color, 'main']) || theme.palette.primary.main;

  return `
    border-color: ${containColor};
    background-color: ${containColor};
    color: ${fontColor};

    &:hover {
      border-color: ${darken(0.05, containColor)};
      background-color: ${darken(0.05, containColor)};
    }

    &:active {
      border-color: ${darken(0.1, containColor)};
      background-color: ${darken(0.1, containColor)};
    }
  `;
};

const getVariantCss = ({ variant }) => {
  if (variant === 'outlined') {
    return css`
      transition: color 0.25s, border-color 0.25s;
      background-color: transparent;
      ${getOutlinedColorCss}
    `;
  } else if (variant === 'contained') {
    return css`
      transition: background-color 0.25s, border-color 0.25s;
      ${getContainedColorCss}
    `;
  }
};

const ButtonBase = styled.button`
  outline: none;
  padding: 6px 16px;
  border-radius: ${getThemeProp('shape.borderRadius')};
  font-family: ${getThemeProp('typography.fontFamily')};
  font-size: 1rem;
  border: 2px solid;
  line-height: 1.5;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;

  ${getVariantCss}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
      justify-content: center;
    `}
`;

const Button = ({ variant = 'contained', color = 'primary', ...props }) => (
  <ButtonBase variant={variant} color={color} ref={props.innerRef} {...props} />
);

export default Button;
