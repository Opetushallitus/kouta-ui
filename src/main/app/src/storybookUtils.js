import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';

import createStore from './state/store';
export const makeStoreDecorator = ({ logging = false } = {}) => storyFn => {
  const store = createStore({});
  const storeAction = action('change');

  if (logging) {
    store.subscribe(() => {
      storeAction(store.getState());
    });
  }

  return <Provider store={store}>{storyFn()}</Provider>;
};
