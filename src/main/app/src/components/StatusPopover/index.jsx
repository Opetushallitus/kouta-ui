import React from 'react';
import styled, { css } from 'styled-components';

import { getThemeProp, spacing } from '../../theme';
import Dropdown from '../Dropdown';
import Flex, { FlexItem } from '../Flex';
import Icon from '../Icon';
import Typography from '../Typography';

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
  ...props
}) => {
  const overlay = (
    <Container>
      <Header status={status}>
        <Flex alignCenter justifyBetween>
          <FlexItem>
            <Flex alignCenter>
              <FlexItem>
                <StatusIcon type="check_circle_outline" />
              </FlexItem>
              <FlexItem paddingTop={2} paddingLeft={2} paddingBottom={2}>
                <HeaderTypography>{header}</HeaderTypography>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem paddingLeft={2}>
            <CloseIcon />
          </FlexItem>
        </Flex>
      </Header>
      <Body>{body}</Body>
    </Container>
  );

  return (
    <Dropdown overlay={overlay} visible={visible} {...props}>
      {children}
    </Dropdown>
  );
};

export default StatusPopover;
