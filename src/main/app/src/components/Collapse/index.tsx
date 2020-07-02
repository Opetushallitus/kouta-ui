import React from 'react';
import styled, { css } from 'styled-components';
import { setLightness } from 'polished';
import { isString, noop } from 'lodash';
import { getThemeProp, spacing } from '../../theme';
import Typography from '../Typography';
import DropdownIcon from '../DropdownIcon';
import CollapseContent from '../CollapseContent';
import Box from '../Box';

const Container = styled.div`
  border: 1px solid ${getThemeProp('palette.divider')};
  background-color: white;

  ${({ active }) =>
    active &&
    css`
      border-color: ${getThemeProp('palette.primary.main')};
      box-shadow: 0 0 0 1px ${getThemeProp('palette.primary.main')},
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

const HeaderContainer = styled.div`
  display: flex;

  ${({ open }) =>
    open &&
    css`
      border-bottom: 1px solid ${getThemeProp('palette.divider')};
    `}
`;

const HeaderContent = styled.div`
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
  return isString(header) ? (
    <Typography variant="h5" p={3}>
      {header}
    </Typography>
  ) : (
    header
  );
};

const Collapse = ({
  header = null,
  footer = null,
  children = null,
  open,
  active = false,
  onToggle = noop,
  toggleOnHeaderClick = true,
  ...props
}) => {
  return (
    <Container active={active} {...props}>
      <HeaderContainer open={open}>
        <HeaderContent
          toggleOnHeaderClick={toggleOnHeaderClick}
          onClick={toggleOnHeaderClick ? onToggle : noop}
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
