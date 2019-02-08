import React, { Component } from 'react';

class FormCollapseGroup extends Component {
  static defaultProps = {
    enabled: true,
    defaultActiveStep: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeStep: this.props.defaultActiveStep,
    };
  }

  getChildrenCount() {
    const { children } = this.props;

    return React.Children.count(children);
  }

  makeOnContinue = (index, child) => () => {
    if (child.props.onContinue) {
      child.props.onContinue();
    }

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
            onContinue: index < this.getChildrenCount() - 1 ? this.makeOnContinue(index, child) : null,
          }
        : {
            controlled: false,
          };

      return React.cloneElement(child, childProps);
    });
  }
}

export default FormCollapseGroup;
