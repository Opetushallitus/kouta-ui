import React, { Component } from 'react';
import useToaster from '#/src/hooks/useToaster';

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
    // Call onError only once
    !this.state.hasError && this.props.onError(error);
  }

  render() {
    return this.state.hasError ? <></> : this.props.children;
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
