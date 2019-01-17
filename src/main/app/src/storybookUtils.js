import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import Async from 'react-async';
import { urls as ophUrls } from 'oph-urls-js';
import axios from 'axios';

import createStore from './state/store';
import configureUrls from './apiUrls';
import HttpContext from './components/HttpContext';
import UrlContext from './components/UrlContext';

const defaultHttpClient = axios.create({});
const configureOphUrls = () => configureUrls(ophUrls);

export const makeApiDecorator = ({
  httpClient = defaultHttpClient,
} = {}) => storyFn => {
  return (
    <HttpContext.Provider value={httpClient}>
      <Async promiseFn={configureOphUrls}>
        {({ data }) =>
          data ? (
            <UrlContext.Provider value={data}>{storyFn()}</UrlContext.Provider>
          ) : null
        }
      </Async>
    </HttpContext.Provider>
  );
};

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
