import React from 'react';

import { setLightness } from 'polished';
import styled, { css } from 'styled-components';

import { Typography, Icon, Box } from '#/src/components/virkailija';
import { spacing, getThemeProp } from '#/src/theme';
import type { Theme } from '#/src/theme';

type Status = 'info' | 'danger' | 'success';

const getIconByStatus = (status: Status) => {
  switch (status) {
    case 'info':
      return 'info';
    case 'danger':
      return 'error';
    case 'success':
      return 'check_circle';
    default:
      return undefined;
  }
};

const getStatusColor = ({
  status,
  theme,
}: {
  status: Status;
  theme: Theme;
}) => {
  if (status === 'danger') {
    return theme.colors.danger.main;
  } else if (status === 'success') {
    return theme.colors.success.main;
  }

  return theme.colors.primary.main;
};

const StatusIcon = styled(Icon)`
  font-size: 1.8rem;
  color: ${getStatusColor};
`;
const getStatusCss = ({ status, theme }: { status: Status; theme: Theme }) => {
  const color = getStatusColor({ theme, status });

  return css`
    border-color: ${color};
    background-color: ${setLightness(0.95, color)};
  `;
};

const AlertBase = styled.div<{ hasTitle: boolean; status: Status }>`
  padding: ${spacing(2)};
  display: flex;
  border-radius: ${getThemeProp('shape.borderRadius')};
  border: 1px solid;

  ${({ hasTitle }) => !hasTitle && 'align-items: center'}

  ${getStatusCss}
`;

type AlertProps = {
  status?: Status;
  title?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
};

export const Alert = ({
  status = 'info',
  title,
  children = null,
  showIcon = true,
}: AlertProps) => {
  const icon = getIconByStatus(status);
  const hasTitle = Boolean(title);

  return (
    <AlertBase status={status} hasTitle={hasTitle}>
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
