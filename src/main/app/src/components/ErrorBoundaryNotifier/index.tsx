import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class ErrorBoundaryNotifier extends Component {
  static defaultProps = {
    onError: () => {},
  };

  constructor(props) {
    super(props);
    this.state = { error: null, info: '' };
  }

  static getDerivedStateFromError(error, info) {
    return { error, info };
  }

  render() {
    const { t } = this.props;
    return this.state.error ? (
      <div style={{ margin: '15px' }}>
        <p>{t('ilmoitukset.tuntematonVirhe')}</p>
        <pre>{this.state.error?.stack ?? ''}</pre>
      </div>
    ) : (
      this.props.children
    );
  }
}

export default withTranslation()(ErrorBoundaryNotifier);
