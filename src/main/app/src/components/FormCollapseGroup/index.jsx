import React, { Component } from 'react';

import { isFunction } from '../../utils';

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

  getChildren() {
    const { children } = this.props;

    return React.Children.toArray(children).filter(c => !!c);
  }

  getChildrenCount() {
    return this.getChildren().length;
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

  componentDidMount() {
    const { scrollTarget } = this.props;

    if (!scrollTarget) {
      return;
    }

    const element = document.getElementById(scrollTarget);

    if (element && isFunction(element.scrollIntoView)) {
      setTimeout(() => {
        element.scrollIntoView();
      }, 500);
    }
  }

  render() {
    const { activeStep } = this.state;
    const { enabled } = this.props;

    return React.Children.map(this.getChildren(), (child, index) => {
      const childProps = enabled
        ? {
            controlled: true,
            index,
            open: index <= activeStep,
            active: index === activeStep,
            onContinue:
              index < this.getChildrenCount() - 1
                ? this.makeOnContinue(index, child)
                : null,
          }
        : {
            controlled: false,
            index,
          };

      return React.cloneElement(child, childProps);
    });
  }
}

export default FormCollapseGroup;
