import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { Transition } from 'react-spring';

import { getThemeProp, spacing } from '../../theme';
import Typography from '../Typography';
import { isString, isFunction } from '../../utils';
import Icon from '../Icon';
import Flex, { FlexItem } from '../Flex';

const Wrapper = styled.div`
  z-index: ${getThemeProp('zIndices.modal')};
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  box-sizing: border-box;
  padding: ${spacing(2)};
`;

const Content = styled.div`
  width: 100%;
  z-index: 2;
  position: relative;
  background-color: white;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);

  ${({ fullWidth }) =>
    !fullWidth &&
    css`
      max-width: ${({ maxWidth }) => maxWidth};
    `}
`;

const HeaderBase = styled.div`
  background-color: ${getThemeProp('palette.primary.main')};

  ${({ isStringChildren }) =>
    isStringChildren &&
    css`
      padding: ${spacing(2)};
    `}
`;

const HeaderTypography = styled(Typography).attrs({
  variant: 'h5',
})`
  color: white;
`;

const Footer = styled.div`
  border-top: 1px solid ${getThemeProp('palette.border')};
  padding: ${spacing(2)};
`;

const BodyWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;

  ${({ minHeight }) =>
    minHeight &&
    css`
      min-height: ${minHeight};
    `}
`;

const Body = styled.div`
  padding: ${spacing(2)};
`;

const CloseIcon = styled(Icon).attrs({ type: 'close' })`
  cursor: pointer;
  color: white;
`;

const nop = () => {};

const Header = ({ children, onClose }) => {
  const isStringChildren = isString(children);

  return (
    <HeaderBase isStringChildren={isStringChildren}>
      <Flex alignCenter>
        <FlexItem grow={1}>
          {isStringChildren ? (
            <HeaderTypography>{children}</HeaderTypography>
          ) : (
            children
          )}
        </FlexItem>
        {isFunction(onClose) ? (
          <FlexItem grow={0} paddingLeft={2}>
            <CloseIcon onClick={onClose} />
          </FlexItem>
        ) : null}
      </Flex>
    </HeaderBase>
  );
};

class ModalDialog extends Component {
  static defaultProps = {
    children: null,
    header: null,
    footer: null,
    overlayStyle: {},
    contentStyle: {},
    maxWidth: '720px',
    fullWidth: false,
  };

  constructor() {
    super();

    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    const {
      children,
      header,
      footer,
      onClose,
      overlayStyle,
      contentStyle,
      maxWidth,
      fullWidth,
      minHeight,
    } = this.props;

    return createPortal(
      <Wrapper>
        <Overlay
          style={overlayStyle}
          onClick={isFunction(onClose) ? onClose : nop}
        />
        <ContentWrapper>
          <Content
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            style={contentStyle}
          >
            {header ? <Header onClose={onClose}>{header}</Header> : null}
            {children ? (
              <BodyWrapper minHeight={minHeight}>
                <Body>{children}</Body>
              </BodyWrapper>
            ) : null}
            {footer ? <Footer>{footer}</Footer> : null}
          </Content>
        </ContentWrapper>
      </Wrapper>,
      this.el,
    );
  }
}

const Modal = ({ open = false, ...props }) => (
  <Transition
    items={open}
    enter={{
      opacity: 1,
      transform: 'scale(1)',
    }}
    leave={{
      opacity: 0,
      transform: 'scale(0.5)',
    }}
    from={{
      opacity: 0,
      transform: 'scale(0.5)',
    }}
  >
    {open =>
      open &&
      (({ opacity, transform }) => (
        <ModalDialog
          {...props}
          overlayStyle={{ opacity }}
          contentStyle={{ opacity, transform }}
        />
      ))
    }
  </Transition>
);

export class ModalController extends Component {
  static defaultProps = {
    defaultOpen: false,
    content: null,
    children: () => null,
    modal: () => null,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: this.props.defaultOpen,
    };
  }

  onToggle = () => {
    this.setState(({ open }) => ({ open: !open }));
  };

  onClose = () => {
    this.setState({ open: false });
  };

  onOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { open } = this.state;
    const { children, modal, defaultOpen, ...restProps } = this.props;

    const renderProps = {
      open,
      onToggle: this.onToggle,
      onClose: this.onClose,
      onOpen: this.onOpen,
      ...restProps,
    };

    return (
      <>
        {modal(renderProps)}
        {children(renderProps)}
      </>
    );
  }
}

export default Modal;
