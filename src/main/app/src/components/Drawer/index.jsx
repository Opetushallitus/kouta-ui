import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Transition } from 'react-spring';

import { getThemeProp } from '../../theme';
import { isFunction } from '../../utils';

const Wrapper = styled.div`
  z-index: ${getThemeProp('zIndex.modal')};
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


const Content = styled.div`
  height: 100vh;
  position: fixed;
  top: 0px;
  right: 0px;
  width: ${({ width }) => width};
  overflow-y: auto;
  z-index: 2;
  box-shadow: 0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12);
  background-color: white;
`;

const nop = () => {};

class DrawerDialog extends Component {
  static defaultProps = {
    children: null,
    overlayStyle: {},
    contentStyle: {},
    width: 'auto',
  };

  constructor() {
    super();

    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
    document.body.style.overflowY = 'hidden';
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
    document.body.style.overflowY = 'auto';
  }

  render() {
    const {
      children,
      onClose,
      overlayStyle,
      contentStyle,
      width,
    } = this.props;

    return createPortal(
      <Wrapper>
        <Overlay
          style={overlayStyle}
          onClick={isFunction(onClose) ? onClose : nop}
        />
          <Content
            width={width}
            style={contentStyle}
          >
            {children}
          </Content>
      </Wrapper>,
      this.el,
    );
  }
}

const Drawer = ({ open = false, ...props }) => (
  <Transition
    items={open}
    enter={{
      opacity: 1,
      transform: 'translateX(0%)',
    }}
    leave={{
      opacity: 0,
      transform: 'translateX(50%)',
    }}
    from={{
      opacity: 0,
      transform: 'translateX(50%)',
    }}
  >
    {open =>
      open &&
      (({ opacity, transform }) => (
        <DrawerDialog
          {...props}
          overlayStyle={{ opacity }}
          contentStyle={{ opacity, transform }}
        />
      ))
    }
  </Transition>
);

export default Drawer;
