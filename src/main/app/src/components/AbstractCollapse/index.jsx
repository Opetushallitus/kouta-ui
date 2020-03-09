import React, { Component } from 'react';
import styled from 'styled-components';
import { hideVisually } from 'polished';

const Hidden = styled.div`
  ${hideVisually()};
`;

class AbstractCollapse extends Component {
  static defaultProps = {
    defaultOpen: false,
    children: () => null,
    content: null,
    unmount: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: props.defaultOpen,
    };
  }

  onToggle = () => {
    this.setState(({ open }) => ({ open: !open }));
  };

  renderContent() {
    const { unmount, content } = this.props;
    const { open } = this.state;

    if (open) {
      return content;
    } else if (unmount) {
      return null;
    } else {
      return <Hidden>{content}</Hidden>;
    }
  }

  render() {
    const { children } = this.props;
    const { open } = this.state;

    return (
      <>
        {children({ open, onToggle: this.onToggle })}
        {this.renderContent()}
      </>
    );
  }
}

export default AbstractCollapse;
