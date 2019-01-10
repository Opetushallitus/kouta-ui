import React from 'react';
import { darken } from 'polished';
import styled, { css } from 'styled-components';

import { getThemeProp } from '../../theme';

const getOutlinedColorCss = ({ color, theme }) => {
  let outlineColor = theme.palette.primary.main;

  if (color === 'secondary') {
    outlineColor = theme.palette.secondary.main;
  }

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
  let fontColor = theme.palette.primary.contrastText;
  let containColor = theme.palette.primary.main;

  if (color === 'secondary') {
    fontColor = theme.palette.secondary.contrastText;
    containColor = theme.palette.secondary.main;
  }

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

  ${getVariantCss}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

const Button = ({ variant = 'contained', color = 'primary', ...props }) => (
  <ButtonBase variant={variant} color={color} ref={props.innerRef} {...props} />
);

export default Button;
