import React, { Component } from 'react';

class FormCollapseGroup extends Component {
  static defaultProps = {
    enabled: true,
  };

  constructor() {
    super();

    this.state = {
      activeStep: 0,
    };
  }

  getChildrenCount() {
    const { children } = this.props;

    return React.Children.count(children);
  }

  makeOnContinue = index => () => {
    if (index < this.getChildrenCount() - 1) {
      return this.setState(() => ({
        activeStep: index + 1,
      }));
    }
  };

  render() {
    const { activeStep } = this.state;
    const { enabled, children } = this.props;
 
    return React.Children.map(children, (child, index) => {
      const childProps = enabled
        ? {
            controlled: true,
            open: index <= activeStep,
            active: index === activeStep,
            onContinue: index < this.getChildrenCount() - 1 ? this.makeOnContinue(index) : null,
          }
        : {
            controlled: false,
          };

      return React.cloneElement(child, childProps);
    });
  }
}

export default FormCollapseGroup;