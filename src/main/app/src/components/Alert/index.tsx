import React from 'react';

import { setLightness } from 'polished';
import styled, { css } from 'styled-components';

import { Typography, Icon, Box } from '#/src/components/virkailija';
import { spacing, getThemeProp } from '#/src/theme';

const getIconByStatus = status => {
  if (status === 'info') {
    return 'info';
  } else if (status === 'danger') {
    return 'error';
  } else if (status === 'success') {
    return 'check_circle';
  }

  return undefined;
};

const getStatusColor = ({ status, theme }) => {
  if (status === 'danger') {
    return theme.palette.danger.main;
  } else if (status === 'success') {
    return theme.palette.success.main;
  }

  return theme.palette.primary.main;
};

const StatusIcon = styled(Icon)`
  font-size: 1.8rem;
  color: ${getStatusColor};
`;
const getStatusCss = ({ status, theme }) => {
  const color = getStatusColor({ theme, status });

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

  ${getStatusCss}
`;

const Alert = ({
  status = 'info',
  title = null,
  children = null,
  showIcon = true,
  ...props
}) => {
  const icon = getIconByStatus(status);
  const hasTitle = Boolean(title);

  return (
    <AlertBase status={status} hasTitle={hasTitle} {...props}>
      {icon && showIcon ? (
        <StatusIcon status={status} type={icon} mr={2} />
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
