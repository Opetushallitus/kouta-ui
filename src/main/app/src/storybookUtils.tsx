import React, { Suspense } from 'react';

import { action } from '@storybook/addon-actions';
import axios from 'axios';
import { urls as ophUrls } from 'oph-urls-js';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
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

const ApiDecorator = ({ httpClient, children }) => {
  const { data: urlData } = useQuery('configureUrls', configureOphUrls, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return urlData ? (
    <HttpContext.Provider value={httpClient}>
      {urlData ? (
        <UrlContext.Provider value={urlData}>{children}</UrlContext.Provider>
      ) : null}
    </HttpContext.Provider>
  ) : null;
};

export const makeApiDecorator =
  ({ httpClient = defaultHttpClient } = {}) =>
  storyFn => {
    return <ApiDecorator httpClient={httpClient}>{storyFn()}</ApiDecorator>;
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

export const routerDecorator = storyFn => (
  <MemoryRouter initialEntries={['/']}>{storyFn()}</MemoryRouter>
);
