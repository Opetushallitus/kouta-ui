import React from 'react';
import styled, { css } from 'styled-components';
import { setLightness } from 'polished';

import Typography from '../Typography';
import { spacing, getThemeProp } from '../../theme';
import Icon from '../Icon';
import Box from '../Box';

const getIconByVariant = variant => {
  if (variant === 'info') {
    return 'info';
  } else if (variant === 'danger') {
    return 'error';
  } else if (variant === 'success') {
    return 'check_circle';
  }

  return undefined;
};

const getVariantColor = ({ variant, theme }) => {
  if (variant === 'danger') {
    return theme.palette.danger.main;
  } else if (variant === 'success') {
    return theme.palette.success.main;
  }

  return theme.palette.primary.main;
};

const VariantIcon = styled(Icon)`
  font-size: 1.8rem;
  color: ${getVariantColor};
`;
const getVariantCss = ({ variant, theme }) => {
  const color = getVariantColor({ theme, variant });

  return css`
    border-color: ${color};
    background-color: ${setLightness(0.95, color)};
  `;
};

const AlertBase = styled.div`
  padding: ${spacing(2)};
  display: flex;
  border-radius: ${getThemeProp('shape.borderRadius')};
  border: 1px solid;

  ${({ hasTitle }) => !hasTitle && 'align-items: center'}

  ${getVariantCss}
`;

const Alert = ({
  variant = 'info',
  title = null,
  children = null,
  showIcon = true,
  ...props
}) => {
  const icon = getIconByVariant(variant);
  const hasTitle = Boolean(title);

  return (
    <AlertBase variant={variant} hasTitle={hasTitle} {...props}>
      {icon && showIcon ? (
        <VariantIcon variant={variant} type={icon} mr={2} />
      ) : null}
      <Box flexGrow={1}>
        {title ? (
          <Typography mb={children ? 1 : 0} variant="h6">
            {title}
          </Typography>
        ) : null}
        {children ? (
          <Typography color={hasTitle ? 'text.primary' : 'text.heading'}>
            {children}
          </Typography>
        ) : null}
      </Box>
    </AlertBase>
  );
};

export default Alert;
