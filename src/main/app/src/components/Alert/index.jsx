import React from 'react';
import styled, { css } from 'styled-components';
import { setLightness } from 'polished';

import Typography from '../Typography';
import { spacing, getThemeProp } from '../../theme';
import Icon from '../Icon';
import Flex, { FlexItem } from '../Flex';

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
  font-size: 2.2rem;
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
  border-radius: ${getThemeProp('shape.borderRadius')};
  border: 1px solid;
  ${getVariantCss}
`;

const Alert = ({
  variant = 'info',
  message,
  description: descriptionProp = null,
  children = null,
  showIcon = true,
  ...props
}) => {
  const icon = getIconByVariant(variant);
  const description = descriptionProp || children;

  return (
    <AlertBase variant={variant} {...props}>
      <Flex>
        {icon && showIcon ? (
          <FlexItem grow={0} marginRight={2}>
            <VariantIcon variant={variant} type={icon} />
          </FlexItem>
        ) : null}
        <FlexItem grow={1}>
          {message ? (
            <Typography marginBottom={description ? 1 : 0} variant="h6">
              {message}
            </Typography>
          ) : null}
          {description ? <Typography>{description}</Typography> : null}
        </FlexItem>
      </Flex>
    </AlertBase>
  );
};

export default Alert;
