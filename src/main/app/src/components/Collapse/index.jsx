import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { hideVisually } from 'polished';

import { isString } from '../../utils';
import { getThemeProp } from '../../theme';
import Typography from '../Typography';
import Icon from '../Icon';

const Container = styled.div`
  border: 1px solid ${getThemeProp('palette.border')};
  background-color: white;
`;

const HeaderToggle = styled.div`
  flex: 0;
  background-color: ${getThemeProp('palette.primary.dark')};
  display: flex;
  align-items: center;
  min-height: 3rem;
  padding: 0px ${({ theme }) => theme.spacing.unit * 2}px;
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

  ${({ active }) =>
    active &&
    css`
      background-color: ${getThemeProp('palette.primary.light')};
    `}
`;

const FooterContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.unit * 2}px;
  border-top: 1px solid ${getThemeProp('palette.border')};
`;

const ToggleIcon = styled(Icon)`
  color: white;
  font-size: 2rem;
`;

const ContentWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const HeaderTextContent = styled(Typography).attrs({ variant: 'h5' })`
  padding: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const ContentContainer = styled.div`
  ${({ open }) => !open && hideVisually()};
`;

const renderHeader = header => {
  return isString(header) ? (
    <HeaderTextContent>{header}</HeaderTextContent>
  ) : (
    header
  );
};

const getIconType = open => {
  return open ? 'expand_less' : 'expand_more';
};

const nop = () => {};

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
  <Container {...props}>
    <HeaderContainer open={open}>
      <HeaderContent
        toggleOnHeaderClick={toggleOnHeaderClick}
        onClick={toggleOnHeaderClick ? onToggle : nop}
        active={active}
      >
        {renderHeader(header)}
      </HeaderContent>
      <HeaderToggle onClick={onToggle}>
        <ToggleIcon type={getIconType(open)} />
      </HeaderToggle>
    </HeaderContainer>
    <ContentContainer open={open}>
      <ContentWrapper>{children}</ContentWrapper>
      {footer ? <FooterContainer>{footer}</FooterContainer> : null}
    </ContentContainer>
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
