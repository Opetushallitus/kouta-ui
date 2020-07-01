import React, { Component } from 'react';
import useToaster from '#/src/components/useToaster';

class ErrorBoundaryNotifier extends Component {
  static defaultProps = {
    onError: () => {},
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.props.onError(error);
  }

  render() {
    return this.props.children;
  }
}

export default ({ children }) => {
  const { openGenericErrorToast } = useToaster();
  return (
    <ErrorBoundaryNotifier onError={openGenericErrorToast}>
      {children}
    </ErrorBoundaryNotifier>
  );
};
