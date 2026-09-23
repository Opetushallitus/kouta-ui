import React, { Component, type ReactNode } from 'react';

import { type WithTranslation, withTranslation } from 'react-i18next';

type OwnProps = {
  children: ReactNode;
};

type Props = OwnProps & WithTranslation;

type State = {
  error: Error | null;
};

class ErrorBoundaryNotifier extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { t } = this.props;
    return this.state.error ? (
      <div style={{ margin: '15px' }}>
        <p>{t('ilmoitukset.tuntematonVirhe.viesti')}</p>
        <pre>{this.state.error.stack ?? ''}</pre>
      </div>
    ) : (
      this.props.children
    );
  }
}

export default withTranslation()(ErrorBoundaryNotifier);
