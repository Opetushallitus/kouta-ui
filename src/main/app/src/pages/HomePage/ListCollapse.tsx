import React, { useState } from 'react';

import styled from 'styled-components';

import Collapse, { CollapseProps } from '#/src/components/Collapse';
import { Box, Icon, Typography } from '#/src/components/virkailija';
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

type ListCollapseProps = {
  actions: React.ReactNode;
  defaultOpen?: boolean;
  header?: React.ReactNode;
  icon?: string;
} & Omit<CollapseProps, 'open'>;

const ListCollapse = ({
  actions,
  header,
  icon,
  toggleOnHeaderClick = false,
  defaultOpen = true,
  ...props
}: ListCollapseProps) => {
  const [isOpen, setOpen] = useState(() => defaultOpen);

  const collapseHeader = (
    <HeaderWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <HeaderContainer>
            {icon ? <HeaderIcon type={icon} /> : null}
            {header ? (
              <HeaderTypography marginLeft={2}>{header}</HeaderTypography>
            ) : null}
          </HeaderContainer>
        </Box>
        {actions ? <Box>{actions}</Box> : null}
      </Box>
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
