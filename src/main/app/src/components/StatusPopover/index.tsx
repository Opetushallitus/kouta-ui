import React from 'react';

import _ from 'lodash';
import styled, { css } from 'styled-components';

import { Box, Dropdown, Icon, Typography } from '#/src/components/virkailija';
import { getThemeProp, spacing } from '#/src/theme';

const Header = styled.div`
  ${({ status }) =>
    status === 'success' &&
    css`
      background-color: ${getThemeProp('palette.success.main')};
    `}

  ${({ status }) =>
    status === 'danger' &&
    css`
      background-color: ${getThemeProp('palette.danger.main')};
    `} 
  
  padding: 0px ${spacing(4)};
`;

const Body = styled.div`
  padding: ${spacing(4)};
`;

const HeaderTypography = styled(Typography)`
  font-size: 1.3rem;
  color: white;
`;

const StatusIcon = styled(Icon)`
  color: white;
  font-size: 1.5rem;
`;

const CloseIcon = styled(Icon).attrs({ type: 'close' })`
  color: white;
  cursor: pointer;
`;

const Container = styled.div`
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.17);
  background-color: white;
`;

export const StatusPopover = ({
  status = 'success',
  header = null,
  body = null,
  visible = false,
  placement = 'top-right',
  children,
  onClose,
  ...props
}) => {
  const canClose = _.isFunction(onClose);

  const overlay = (
    <Container>
      <Header status={status}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Box display="flex" alignItems="center">
              <Box>
                <StatusIcon
                  type={
                    status === 'success'
                      ? 'check_circle_outline'
                      : 'error_outline'
                  }
                />
              </Box>
              <Box paddingTop={2} paddingLeft={2} paddingBottom={2}>
                <HeaderTypography>{header}</HeaderTypography>
              </Box>
            </Box>
          </Box>
          {canClose ? (
            <Box paddingLeft={2}>
              <CloseIcon onClick={onClose} />
            </Box>
          ) : null}
        </Box>
      </Header>
      <Body>{body}</Body>
    </Container>
  );

  return (
    <Dropdown
      overlay={overlay}
      visible={visible}
      placement={placement}
      {...props}
    >
      {children}
    </Dropdown>
  );
};

export default StatusPopover;
