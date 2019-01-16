import React, { Component } from 'react';

class FormStepper extends Component {
  static defaultProps = {
    initialStep: 0,
    stepCount: 0,
    children: () => null,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeStep: props.initialStep,
    };
  }

  onNext = () => {
    const { stepCount } = this.props;

    this.setState(({ activeStep }) => {
      return activeStep < stepCount - 1 ? { activeStep: activeStep + 1 } : null;
    });
  };

  makeOnGoToStep = step => () => {
    const { stepCount } = this.props;

    this.setState(({ activeStep }) => {
      return step < stepCount && step > activeStep
        ? { activeStep: step }
        : null;
    });
  };

  render() {
    const { children } = this.props;
    const { activeStep } = this.state;

    return children({
      activeStep,
      onNext: this.onNext,
      makeOnGoToStep: this.makeOnGoToStep,
    });
  }
}

export default FormStepper;
