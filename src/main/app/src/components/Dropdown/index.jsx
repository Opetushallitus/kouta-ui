import React, { Component } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';

export const DropdownMenu = styled.div`
  width: 100%;
  min-width: 200px;
  border: 1px solid ${getThemeProp('palette.border')};
  border-radius: ${getThemeProp('shape.borderRadius')};
  box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);
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
  ...props
}) => (
  <Manager>
    <Reference>{children}</Reference>
    {visible ? (
      <Popper placement={defaultPlacement}>
        {({ ref, style, placement }) => (
          <div
            ref={ref}
            style={{ ...style, ...getMarginStyle(placement) }}
            data-placement={placement}
            {...props}
          >
            {overlay}
          </div>
        )}
      </Popper>
    ) : null}
  </Manager>
);

export class UncontrolledDropdown extends Component {
  static defaultProps = {
    toggleOnOverlayClick: true,
    overlay: null,
    defaultVisible: false,
    children: () => null,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: props.defaultVisible,
    };

    this.overlayRef = React.createRef();
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

  render() {
    const { visible } = this.state;
    const {
      defaultVisible,
      children,
      overlay,
      toggleOnOverlayClick,
      ...props
    } = this.props;

    const wrappedOverlay = <div onClick={this.onOverlayClick}>{overlay}</div>;

    return (
      <Dropdown visible={visible} overlay={wrappedOverlay} {...props}>
        {({ ref }) => {
          return children({ ref, visible, onToggle: this.onToggle });
        }}
      </Dropdown>
    );
  }
}

export default Dropdown;
