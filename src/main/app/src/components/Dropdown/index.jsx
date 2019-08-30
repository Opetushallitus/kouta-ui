import React, { Component, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';
import styled from 'styled-components';
import EventListener from 'react-event-listener';
import { Transition } from 'react-spring';

import { getThemeProp } from '../../theme';
import { isFunction } from '../../utils';
import memoizeOne from '../../utils/memoizeOne';

export const DropdownMenu = styled.div.attrs({ role: 'menu' })`
  width: 100%;
  min-width: 200px;
  border: 1px solid ${getThemeProp('palette.border')};
  border-radius: ${getThemeProp('shape.borderRadius')};
  box-shadow: ${getThemeProp('shadows[1]')};
  background-color: white;
`;

export const DropdownMenuItem = styled.div.attrs({ role: 'menuitem' })`
  display: block;
  width: 100%;
  white-space: nowrap;
  font-family: ${getThemeProp('typography.fontFamily')};
  color: ${getThemeProp('palette.text.primary')};
  padding: 8px 12px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.25s, color 0.25s;

  &:hover {
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

const DropdownDialog = ({
  overlay,
  visible,
  placement: placementProp,
  modifiers = {},
  ...props
}) => (
  <Transition
    items={visible}
    enter={{
      opacity: 1,
      scale: 1,
    }}
    leave={{
      opacity: 0,
      scale: 0.9,
    }}
    from={{
      opacity: 0,
      scale: 0.9,
    }}
  >
    {visible =>
      visible &&
      (({ opacity, scale }) => (
        <Popper placement={placementProp} modifiers={modifiers}>
          {({ ref, style, placement }) => {
            const { transform: popperTransform = '', ...restStyle } = style;

            return (
              <div
                ref={ref}
                style={{
                  ...restStyle,
                  ...getMarginStyle(placement),
                  zIndex: '1',
                  opacity,
                  transform: `${popperTransform} scaleY(${scale})`,
                }}
                data-placement={placement}
                {...props}
              >
                {overlay}
              </div>
            );
          }}
        </Popper>
      ))
    }
  </Transition>
);

const Dropdown = ({
  placement: defaultPlacement = 'bottom-start',
  overlay = null,
  visible = false,
  children = () => {},
  portalTarget,
  overflow,
  onOutsideClick,
  onOverlayClick,
  ...props
}) => {
  const modifiers = {
    ...(overflow && { preventOverflow: { enabled: false } }),
  };

  const overlayRef = useRef();
  const targetRef = useRef();
  const wrappedOverlay = overlay ? <div ref={overlayRef}>{overlay}</div> : null;

  const createForwardingRef = useRef(
    memoizeOne(ref => {
      return node => {
        targetRef.current = node;

        ref(node);
      };
    }),
  );

  const childrenFn = useCallback(
    ({ ref, ...rest }) => {
      return children({
        ref: createForwardingRef.current(ref),
        ...rest,
      });
    },
    [children],
  );

  const onWindowClick = useCallback(
    e => {
      const isTriggerElement =
        targetRef.current &&
        (targetRef.current === e.target ||
          targetRef.current.contains(e.target));

      const isOverlay =
        overlayRef.current &&
        (overlayRef.current === e.target ||
          overlayRef.current.contains(e.target));

      if (isOverlay && isFunction(onOverlayClick)) {
        return onOverlayClick();
      }

      if (!isTriggerElement && isFunction(onOutsideClick) && visible) {
        return onOutsideClick();
      }
    },
    [onOverlayClick, onOutsideClick, visible],
  );

  const content = (
    <DropdownDialog
      overlay={wrappedOverlay}
      modifiers={modifiers}
      visible={visible}
      placement={defaultPlacement}
      {...props}
    />
  );

  return (
    <>
      {isFunction(onOutsideClick) || isFunction(onOverlayClick) ? (
        <EventListener target="window" onClick={onWindowClick} />
      ) : null}
      <Manager>
        <Reference>{childrenFn}</Reference>
        {portalTarget ? createPortal(content, portalTarget) : content}
      </Manager>
    </>
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

  renderChildren = ({ ref }) => {
    return this.props.children({
      ref,
      visible: this.state.visible,
      onToggle: this.onToggle,
    });
  };

  renderOverlay() {
    const { overlay } = this.props;

    if (isFunction(overlay)) {
      return overlay({ onToggle: this.onToggle });
    }

    return overlay;
  }

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

    return (
      <>
        <Dropdown
          visible={visible}
          overlay={this.renderOverlay()}
          onOutsideClick={toggleOnOutsideClick ? this.onToggle : null}
          onOverlayClick={toggleOnOverlayClick ? this.onToggle : null}
          {...props}
        >
          {this.renderChildren}
        </Dropdown>
      </>
    );
  }
}

export default Dropdown;
