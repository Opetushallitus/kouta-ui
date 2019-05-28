import React from 'react';
import styled, { css } from 'styled-components';
import { setLightness } from 'polished';

import Typography from '../Typography';
import { spacing, getThemeProp } from '../../theme';

const getVariantCss = ({ variant, theme }) => {
  let color = theme.palette.primary.main;

  if (variant === 'danger') {
    color = theme.palette.danger.main;
  } else if (variant === 'success') {
    color = theme.palette.success.main;
  }

  return css`
    border-color: ${color};
    background-color: ${setLightness(0.95, color)};
  `;
};

const AlertBase = styled.div`
  padding: ${spacing(2)};
  border-radius: ${getThemeProp('shape.borderRadius')};
  border: 1px solid;
  ${getVariantCss}
`;

const Alert = ({
  variant = 'info',
  message,
  description: descriptionProp = null,
  children = null,
  ...props
}) => {
  const description = descriptionProp || children;

  return (
    <AlertBase variant={variant} {...props}>
      {message ? (
        <Typography marginBottom={description ? 1 : 0} variant="h6">
          {message}
        </Typography>
      ) : null}
      {description ? <Typography>{description}</Typography> : null}
    </AlertBase>
  );
};

export default Alert;
