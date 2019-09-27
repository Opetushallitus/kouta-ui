import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import Toaster from './index';

const toastsArray = [
  {
    label: 'Koulutus on tallennettu onnistuneesti',
    status: 'info',
    key: '1',
  },
  {
    label:
      'Jokin meni vikaan. Jos virhe aiheuttaa ongelmia, yritä päivittää sivu',
    status: 'danger',
    key: '2',
  },
];

class StatefulToaster extends Component {
  constructor() {
    super();

    this.state = {
      toasts: [],
    };
  }

  onClose = key => {
    this.setState(({ toasts }) => ({
      toasts: [...toasts.filter(({ key: k }) => k !== key)],
    }));
  };

  onAdd = toast => {
    this.setState(({ toasts }) => ({
      toasts: [toast, ...toasts],
    }));
  };

  render() {
    return this.props.children({
      toasts: this.state.toasts,
      onClose: this.onClose,
      onAdd: this.onAdd,
    });
  }
}

storiesOf('Toaster', module).add('Basic', () => (
  <StatefulToaster>
    {({ toasts, onClose, onAdd }) => (
      <>
        <Toaster
          toasts={toasts}
          style={{ position: 'fixed', top: '16px', right: '16px' }}
          onClose={onClose}
        />
        <button
          onClick={() =>
            onAdd({
              ...toastsArray[Math.random() < 0.5 ? 0 : 1],
              key: Math.random() * 1000,
            })
          }
        >
          Add toast
        </button>
      </>
    )}
  </StatefulToaster>
));
