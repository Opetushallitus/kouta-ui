import React from 'react';

import _ from 'lodash';
import { setLightness } from 'polished';
import styled, { css } from 'styled-components';

import { CollapseContent } from '#/src/components/CollapseContent';
import { Box, DropdownIcon, Typography } from '#/src/components/virkailija';
import { getThemeProp, spacing } from '#/src/theme';

const Container = styled.div<{ active: boolean }>`
  border: 1px solid ${getThemeProp('palette.divider')};
  background-color: white;

  ${({ active }) =>
    active &&
    css`
      border-color: ${getThemeProp('palette.primary.main')};
      box-shadow:
        0 0 0 1px ${getThemeProp('palette.primary.main')},
        0 0 7px 1px
          ${({ theme }) => setLightness(0.8, theme.palette.primary.main)};
    `}
`;

const HeaderToggle = styled.div`
  flex: 0;
  display: flex;
  align-items: center;
  padding: 0px ${spacing(3)};
  cursor: pointer;
`;

const HeaderContainer = styled.div<{ open: boolean }>`
  display: flex;

  ${({ open }) =>
    open &&
    css`
      border-bottom: 1px solid ${getThemeProp('palette.divider')};
    `}
`;

const HeaderContent = styled.div<{ toggleOnHeaderClick: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;
  background-color: white;

  ${({ toggleOnHeaderClick }) =>
    toggleOnHeaderClick &&
    css`
      cursor: pointer;
    `}
`;

const FooterContainer = styled.div`
  padding: ${spacing(3)};
  border-top: 1px solid ${getThemeProp('palette.divider')};
`;

const ToggleIcon = styled(DropdownIcon)`
  color: ${getThemeProp('palette.text.dark')};
  font-size: 2rem;
`;

const renderHeader = header => {
  return _.isString(header) ? (
    <Typography variant="h5" p={3}>
      {header}
    </Typography>
  ) : (
    header
  );
};

export type CollapseProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  open: boolean;
  active?: boolean;
  onToggle?: () => void;
  toggleOnHeaderClick?: boolean;
};

const Collapse = ({
  header = null,
  footer = null,
  children = null,
  open,
  active = false,
  onToggle = _.noop,
  toggleOnHeaderClick = true,
  ...props
}: CollapseProps) => {
  return (
    <Container active={active} {...props}>
      <HeaderContainer open={open}>
        <HeaderContent
          toggleOnHeaderClick={toggleOnHeaderClick}
          onClick={toggleOnHeaderClick ? onToggle : _.noop}
        >
          {renderHeader(header)}
        </HeaderContent>
        <HeaderToggle onClick={onToggle}>
          <ToggleIcon icon="expand_more" role="button" open={open} />
        </HeaderToggle>
      </HeaderContainer>
      <CollapseContent open={open}>
        <div className="CollapseContent">
          <Box p={3}>{children}</Box>
          {footer ? <FooterContainer>{footer}</FooterContainer> : null}
        </div>
      </CollapseContent>
    </Container>
  );
};

export default Collapse;
