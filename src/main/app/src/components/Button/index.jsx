import React from 'react';
import { lighten } from 'polished';
import styled, { css } from 'styled-components';
import get from 'lodash/get';

import { getThemeProp } from '../../theme';

const getOutlinedColorCss = ({ color, theme }) => {
  const outlineColor =
    get(theme, ['palette', color, 'main']) || theme.palette.primary.main;

  const hoverColor = lighten(0.05, outlineColor);

  return `
    border-color: ${outlineColor};
    color: ${outlineColor};

    &:hover {
      border-color: ${hoverColor};
      color: ${hoverColor};
    }

    &:active {
      border-color: ${hoverColor};
      color: ${hoverColor};
      box-shadow: 0 0 5px 0 ${hoverColor};
    }
  `;
};

const getContainedColorCss = ({ color, theme }) => {
  const fontColor =
    get(theme, ['palette', color, 'contrastText']) ||
    theme.palette.primary.contrastText;
  const containColor =
    get(theme, ['palette', color, 'main']) || theme.palette.primary.main;

  const hoverColor = lighten(0.05, containColor);

  return `
    border-color: ${containColor};
    background-color: ${containColor};
    color: ${fontColor};

    &:hover {
      border-color: ${hoverColor};
      background-color: ${hoverColor};
    }

    &:active {
      border-color: ${hoverColor};
      background-color: ${hoverColor};
      box-shadow: 0 0 5px 0 ${hoverColor};
    }
  `;
};

const getTextVariantColorCss = ({ color, theme }) => {
  const fontColor =
    get(theme, ['palette', color, 'main']) || theme.palette.primary.main;

  const fontHoverColor = lighten(0.05, fontColor);

  return `
    border-color: transparent;
    background-color: transparent;
    color: ${fontColor};

    &:hover, &:active {
      color: ${fontHoverColor}
    }
  `;
};

const getVariantCss = ({ variant }) => {
  if (variant === 'outlined') {
    return css`
      background-color: transparent;
      ${getOutlinedColorCss}
    `;
  } else if (variant === 'contained') {
    return css`
      ${getContainedColorCss}
    `;
  } else if (variant === 'text') {
    return css`
      ${getTextVariantColorCss}
      padding: 6px 8px;
    `;
  }
};

const getSizeCss = ({ size, variant }) => {
  if (size === 'small') {
    return css`
      font-size: 0.875rem;
      padding: ${variant === 'text' ? '4px 6px' : '4px 10px'};
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
  transition: box-shadow 0.25s, background-color 0.25s, border-color 0.25s;
  font-weight: 500;
  text-decoration: none;

  ${getVariantCss}
  ${getSizeCss};

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

const Button = React.forwardRef(
  (
    { variant = 'contained', color = 'primary', size = 'medium', ...props },
    ref,
  ) => (
    <ButtonBase
      variant={variant}
      color={color}
      size={size}
      ref={ref}
      {...props}
    />
  ),
);

export default Button;
