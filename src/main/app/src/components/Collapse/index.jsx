import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { setLightness } from 'polished';

import { isString, noop } from '../../utils';
import { getThemeProp, spacing } from '../../theme';
import Typography from '../Typography';
import DropdownIcon from '../DropdownIcon';
import CollapseContent from '../CollapseContent';

const Container = styled.div`
  border: 1px solid ${getThemeProp('palette.border')};
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
      border-bottom: 1px solid ${getThemeProp('palette.border')};
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
  border-top: 1px solid ${getThemeProp('palette.border')};
`;

const ToggleIcon = styled(DropdownIcon)`
  color: ${getThemeProp('palette.text.primary')};
  font-size: 2rem;
`;

const ContentWrapper = styled.div`
  padding: ${spacing(3)};
`;

const HeaderTextContent = styled(Typography).attrs({ variant: 'h5' })`
  color: ${getThemeProp('palette.text.dark')};
  padding: ${spacing(3)};
`;

const renderHeader = header => {
  return isString(header) ? (
    <HeaderTextContent>{header}</HeaderTextContent>
  ) : (
    header
  );
};

const Collapse = ({
  header = null,
  footer = null,
  children = null,
  open = false,
  active = false,
  onToggle = () => {},
  toggleOnHeaderClick = true,
  ...props
}) => (
  <Container active={active} {...props}>
    <HeaderContainer open={open}>
      <HeaderContent
        toggleOnHeaderClick={toggleOnHeaderClick}
        onClick={toggleOnHeaderClick ? onToggle : noop}
      >
        {renderHeader(header)}
      </HeaderContent>
      <HeaderToggle onClick={onToggle}>
        <ToggleIcon icon="expand_more" open={open} />
      </HeaderToggle>
    </HeaderContainer>
    <CollapseContent open={open}>
      <ContentWrapper>{children}</ContentWrapper>
      {footer ? <FooterContainer>{footer}</FooterContainer> : null}
    </CollapseContent>
  </Container>
);

export class UncontrolledCollapse extends Component {
  static defaultProps = {
    defaultOpen: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: props.defaultOpen,
    };
  }

  onToggle = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
  };

  render() {
    const { defaultOpen, ...props } = this.props;
    const { open } = this.state;

    return <Collapse open={open} onToggle={this.onToggle} {...props} />;
  }
}

export default Collapse;
