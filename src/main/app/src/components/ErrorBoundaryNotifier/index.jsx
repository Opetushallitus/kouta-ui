import { Component } from 'react';
import { connect } from 'react-redux';

import { createGenericErrorToast } from '../../state/toaster';

class ErrorBoundaryNotifier extends Component {
  static defaultProps = {
    onError: () => {},
  };

  componentDidCatch(error, info) {
    this.props.onError(error);
  }

  render() {
    return this.props.children;
  }
}

export default connect(
  null,
  dispatch => ({
    onError: () => dispatch(createGenericErrorToast()),
  }),
)(ErrorBoundaryNotifier);
