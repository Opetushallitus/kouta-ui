import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Toaster, { Toast } from './index';

const toastsArray = [
  {
    title: 'Koulutus on tallennettu onnistuneesti',
    description: 'Jei',
    status: 'success',
    key: '1',
  },
  {
    title: 'Koulutuksen tallennuksessa ilmeni ongelma',
    description: 'Ouu',
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
        <button onClick={() => onAdd({ ...toastsArray[Math.random() < 0.5 ? 0 : 1], key: Math.random() * 1000 })}>
          Add toast
        </button>
      </>
    )}
  </StatefulToaster>
));
