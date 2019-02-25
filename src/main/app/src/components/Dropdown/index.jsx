import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';
import styled from 'styled-components';
import memoize from 'lodash/memoize';
import EventListener from 'react-event-listener';

import { getThemeProp } from '../../theme';

export const DropdownMenu = styled.div`
  width: 100%;
  min-width: 200px;
  border: 1px solid ${getThemeProp('palette.border')};
  border-radius: ${getThemeProp('shape.borderRadius')};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
  background-color: white;
`;

export const DropdownMenuItem = styled.div`
  display: block;
  width: 100%;
  white-space: nowrap;
  font-family: ${getThemeProp('typography.fontFamily')};
  color: ${getThemeProp('palette.text.primary')};
  padding: 6px 12px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.25s, color 0.25s;

  &:hover {
    color: ${getThemeProp('palette.primary.main')};
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const getMarginStyle = placement => {
  if (!placement) {
    return {};
  }

  if (/^bottom/.test(placement)) {
    return {
      marginTop: '4px',
    };
  }

  if (/^top/.test(placement)) {
    return {
      marginBottom: '4px',
    };
  }

  if (/^right/.test(placement)) {
    return {
      marginLeft: '4px',
    };
  }

  if (/^left/.test(placement)) {
    return {
      marginRight: '4px',
    };
  }

  return {};
};

const Dropdown = ({
  placement: defaultPlacement = 'bottom-start',
  overlay = null,
  visible = false,
  children = () => {},
  portalTarget,
  overflow,
  ...props
}) => {
  const modifiers = {
    ...(overflow && { preventOverflow: { enabled: false } }),
  };

  const content = visible ? (
    <Popper placement={defaultPlacement} modifiers={modifiers}>
      {({ ref, style, placement }) => (
        <div
          ref={ref}
          style={{ ...style, ...getMarginStyle(placement), zIndex: '1' }}
          data-placement={placement}
          {...props}
        >
          {overlay}
        </div>
      )}
    </Popper>
  ) : null;

  return (
    <Manager>
      <Reference>{children}</Reference>
      {portalTarget ? createPortal(content, portalTarget) : content}
    </Manager>
  );
};

export class UncontrolledDropdown extends Component {
  static defaultProps = {
    toggleOnOverlayClick: true,
    overlay: null,
    defaultVisible: false,
    toggleOnOutsideClick: true,
    children: () => null,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: props.defaultVisible,
    };

    this.overlayRef = React.createRef();
    this.triggerElement = null;
  }

  onToggle = () => {
    this.setState(state => ({
      visible: !state.visible,
    }));
  };

  onOverlayClick = () => {
    if (this.props.toggleOnOverlayClick) {
      this.onToggle();
    }
  };

  createWrappedRef = memoize(ref => {
    return node => {
      this.triggerElement = node;

      ref(node);
    };
  });

  renderChildren = ({ ref }) => {
    const wrappedRef = this.createWrappedRef(ref);

    return this.props.children({
      ref: wrappedRef,
      visible: this.state.visible,
      onToggle: this.onToggle,
    });
  };

  onWindowClick = e => {
    const { visible } = this.state;
    const { toggleOnOutsideClick, toggleOnOverlayClick } = this.props;

    const isTriggerElement =
      this.triggerElement &&
      (this.triggerElement === e.target ||
        this.triggerElement.contains(e.target));

    const isOverlay =
      this.overlayRef.current &&
      (this.overlayRef.current === e.target ||
        this.overlayRef.current.contains(e.target));

    if (isOverlay && !toggleOnOverlayClick) {
      return;
    }

    if (!isTriggerElement && toggleOnOutsideClick && visible) {
      this.onToggle();
    }
  };

  render() {
    const { visible } = this.state;
    const {
      defaultVisible,
      children,
      overlay,
      toggleOnOverlayClick,
      toggleOnOutsideClick,
      ...props
    } = this.props;

    const wrappedOverlay = <div ref={this.overlayRef}>{overlay}</div>;

    return (
      <>
        <EventListener target="window" onClick={this.onWindowClick} />
        <Dropdown visible={visible} overlay={wrappedOverlay} {...props}>
          {this.renderChildren}
        </Dropdown>
      </>
    );
  }
}

export default Dropdown;
