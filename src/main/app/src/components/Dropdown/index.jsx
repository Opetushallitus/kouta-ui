import React, { useRef, useCallback, useState, useMemo } from 'react';

import { createPortal } from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';
import styled from 'styled-components';
import EventListener from 'react-event-listener';
import { Transition } from 'react-spring';

import { getThemeProp } from '../../theme';
import { isFunction, noop } from '../../utils';
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
  open,
  placement: placementProp,
  modifiers = {},
  ...props
}) => (
  <Transition
    items={open}
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
    {open =>
      open &&
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
  overlay: overlayProp = null,
  open: openProp,
  children = noop,
  portalTarget,
  overflow,
  onOutsideClick,
  onOverlayClick,
  toggleOnOverlayClick = true,
  toggleOnOutsideClick = true,
  ...props
}) => {
  const [openState, setOpenState] = useState(false);

  const { current: isControlled } = useRef(openProp !== undefined);

  const modifiers = {
    ...(overflow && { preventOverflow: { enabled: false } }),
  };

  const open = isControlled ? Boolean(openProp) : openState;

  const childrenProps = useMemo(() => {
    return isControlled
      ? {}
      : {
          open,
          onClose: () => setOpenState(false),
          onOpen: () => setOpenState(true),
          onToggle: () => setOpenState(o => !o),
        };
  }, [isControlled, open]);

  const overlay = isFunction(overlayProp)
    ? overlayProp(childrenProps)
    : overlayProp;

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
        ...childrenProps,
        ...rest,
      });
    },
    [children, childrenProps],
  );

  const handleOutsideClick = useCallback(() => {
    if (!isControlled && toggleOnOutsideClick) {
      setOpenState(o => !o);
    }

    if (isFunction(onOutsideClick)) {
      onOutsideClick();
    }
  }, [isControlled, onOutsideClick, toggleOnOutsideClick]);

  const handleOverlayClick = useCallback(() => {
    if (!isControlled && toggleOnOverlayClick) {
      setOpenState(o => !o);
    }

    if (isFunction(onOverlayClick)) {
      onOverlayClick();
    }
  }, [isControlled, onOverlayClick, toggleOnOverlayClick]);

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

      if (isOverlay) {
        return handleOverlayClick();
      }

      if (!isTriggerElement && open) {
        return handleOutsideClick();
      }
    },
    [handleOverlayClick, handleOutsideClick, open],
  );

  const content = (
    <DropdownDialog
      overlay={wrappedOverlay}
      modifiers={modifiers}
      open={open}
      placement={defaultPlacement}
      {...props}
    />
  );

  return (
    <>
      <EventListener target="window" onClick={onWindowClick} />
      <Manager>
        <Reference>{childrenFn}</Reference>
        {portalTarget ? createPortal(content, portalTarget) : content}
      </Manager>
    </>
  );
};

export default Dropdown;
