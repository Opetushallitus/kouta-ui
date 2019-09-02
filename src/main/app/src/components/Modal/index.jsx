import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { Transition } from 'react-spring';

import { getThemeProp, spacing } from '../../theme';
import Typography from '../Typography';
import { isString, isFunction, noop } from '../../utils';
import Icon from '../Icon';
import Box from '../Box';

const Wrapper = styled.div.attrs({ role: 'dialog' })`
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

const HeaderWrapper = styled(Box)`
  border-bottom: 1px solid ${getThemeProp('palette.divider')};
`;

const Footer = styled.div`
  border-top: 1px solid ${getThemeProp('palette.divider')};
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

const CloseIcon = styled(Icon).attrs({ type: 'close', role: 'button' })`
  cursor: pointer;
  color: ${getThemeProp('palette.text.dark')};
  opacity: 0.8;
  transition: opacity 0.25s;

  &:hover {
    opacity: 1;
  }
`;

const Header = ({ children, onClose }) => {
  const isStringChildren = isString(children);

  return (
    <HeaderWrapper
      p={isStringChildren ? 2 : 0}
      display="flex"
      alignItems="center"
    >
      <Box flexGrow="1">
        {isStringChildren ? (
          <Typography variant="h5">{children}</Typography>
        ) : (
          children
        )}
      </Box>
      {isFunction(onClose) ? (
        <Box flexGrow="0" pl={2}>
          <CloseIcon onClick={onClose} />
        </Box>
      ) : null}
    </HeaderWrapper>
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
          onClick={isFunction(onClose) ? onClose : noop}
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
                <Box p={2}>{children}</Box>
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

export default Modal;
