import React, { useState } from 'react';

import styled from 'styled-components';

import Collapse from '#/src/components/Collapse';
import { Flex, FlexItem } from '#/src/components/Flex';
import { Icon, Typography } from '#/src/components/virkailija';
import { getThemeProp, spacing } from '#/src/theme';

const HeaderIcon = styled(Icon)`
  font-size: 1.6rem;
  color: ${getThemeProp('palette.text.dark')};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: ${spacing(2)};
`;

const HeaderTypography = styled(Typography).attrs({ variant: 'h4' })`
  color: ${getThemeProp('palette.text.dark')};
`;

const ListCollapse = ({
  actions = null,
  header = null,
  icon = null,
  toggleOnHeaderClick = false,
  defaultOpen = true,
  ...props
}) => {
  const [isOpen, setOpen] = useState(() => defaultOpen);

  const collapseHeader = (
    <HeaderWrapper>
      <Flex justifyBetween alignCenter>
        <FlexItem>
          <HeaderContainer>
            {icon ? <HeaderIcon type={icon} /> : null}
            {header ? (
              <HeaderTypography marginLeft={2}>{header}</HeaderTypography>
            ) : null}
          </HeaderContainer>
        </FlexItem>
        {actions ? <FlexItem>{actions}</FlexItem> : null}
      </Flex>
    </HeaderWrapper>
  );

  return (
    <Collapse
      toggleOnHeaderClick={toggleOnHeaderClick}
      header={collapseHeader}
      open={isOpen}
      onToggle={() => setOpen(open => !open)}
      {...props}
    />
  );
};

export default ListCollapse;
