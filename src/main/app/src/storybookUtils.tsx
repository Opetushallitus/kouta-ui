import React, { Suspense } from 'react';

import { action } from '@storybook/addon-actions';
import axios from 'axios';
import { urls as ophUrls } from 'oph-urls-js';
import Async from 'react-async';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import UrlContext from '#/src/contexts/UrlContext';
import defaultTheme from '#/src/theme';

import AuthorizedUserContext from './contexts/AuthorizedUserContext';
import HttpContext from './contexts/HttpClientContext';
import createLocalization from './localization';
import { createStore } from './state';
import getTranslations from './translations';
import { configure as configureUrls } from './urls';

const queryClient = new QueryClient();

const defaultHttpClient = axios.create({});
const configureOphUrls = () => configureUrls(ophUrls, defaultHttpClient);

const getLocalizationInstance = () => {
  const localizationInstance = createLocalization({
    debug: true,
  });

  localizationInstance.addResourceBundle(
    'fi',
    'kouta',
    getTranslations().fi.kouta,
    true
  );

  return localizationInstance;
};

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

export const makeStoreDecorator = ({ logging = false } = {}) => {
  const { store } = createStore();
  const storeAction = action('change');

  if (logging) {
    store.subscribe(() => {
      storeAction(store.getState());
    });
  }
  return storyFn => <Provider store={store}>{storyFn()}</Provider>;
};

export const makeLocalizationDecorator = () => storyFn => {
  const instance = getLocalizationInstance();

  return (
    <Suspense fallback={null}>
      <I18nextProvider i18n={instance}>{storyFn()}</I18nextProvider>
    </Suspense>
  );
};

export const themeDecorator = storyFn => (
  <ThemeProvider theme={defaultTheme}>{storyFn()}</ThemeProvider>
);

export const queryClientDecorator = storyFn => (
  <QueryClientProvider client={queryClient}>{storyFn()}</QueryClientProvider>
);

export const authorizedUserDecorator = storyFn => (
  <AuthorizedUserContext.Provider value={{}}>
    {storyFn()}
  </AuthorizedUserContext.Provider>
);
