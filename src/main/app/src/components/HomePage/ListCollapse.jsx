import React from 'react';
import styled from 'styled-components';

import Flex, { FlexItem } from '../Flex';
import { UncontrolledCollapse } from '../Collapse';
import Icon from '../Icon';
import Typography from '../Typography';
import { getThemeProp, spacing } from '../../theme';

const HeaderIcon = styled(Icon)`
  font-size: 1.6rem;
  color: ${getThemeProp('palette.text.primary')};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: ${spacing(2)};
`;

const ListCollapse = ({
  actions = null,
  header = null,
  icon = null,
  toggleOnHeaderClick = false,
  ...props
}) => {
  const collapseHeader = (
    <HeaderWrapper>
      <Flex justifyBetween alignCenter>
        <FlexItem>
          <HeaderContainer>
            {icon ? <HeaderIcon type={icon} /> : null}
            {header ? (
              <Typography variant="h4" marginLeft={2}>
                {header}
              </Typography>
            ) : null}
          </HeaderContainer>
        </FlexItem>
        {actions ? <FlexItem>{actions}</FlexItem> : null}
      </Flex>
    </HeaderWrapper>
  );

  return (
    <UncontrolledCollapse
      toggleOnHeaderClick={toggleOnHeaderClick}
      header={collapseHeader}
      {...props}
    />
  );
};

export default ListCollapse;
