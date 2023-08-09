import React, { Suspense } from 'react';

import { action } from '@storybook/addon-actions';
import axios from 'axios';
import { urls as ophUrls } from 'oph-urls-js';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useAsync } from 'react-use';
import { ThemeProvider } from 'styled-components';

import UrlContext from '#/src/contexts/UrlContext';
import defaultTheme from '#/src/theme';

import AuthorizedUserContext from './contexts/AuthorizedUserContext';
import HttpContext from './contexts/HttpClientContext';
import createLocalization from './localization';
import { createStore } from './state';
import { translations } from './translations';
import { configure as configureUrls } from './urls';

const queryClient = new QueryClient();

const defaultHttpClient = axios.create({});
const configureOphUrls = () => configureUrls(ophUrls, defaultHttpClient);

const getLocalizationInstance = async () => {
  const localizationInstance = await createLocalization({
    debug: true,
  });

  localizationInstance.addResourceBundle('fi', 'kouta', translations.fi, true);

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
  Story => (
    <ApiDecorator httpClient={httpClient}>
      <Story />
    </ApiDecorator>
  );

export const makeStoreDecorator = ({ logging = false } = {}) => {
  const { store } = createStore();
  const storeAction = action('change');

  if (logging) {
    store.subscribe(() => {
      storeAction(store.getState());
    });
  }
  return Story => (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

export const makeLocalizationDecorator = () => Story => {
  const { value: instance } = useAsync(getLocalizationInstance, []);

  return instance ? (
    <Suspense fallback={null}>
      <I18nextProvider i18n={instance}>
        <Story />
      </I18nextProvider>
    </Suspense>
  ) : null;
};

export const themeDecorator = Story => (
  <ThemeProvider theme={defaultTheme}>
    <Story />
  </ThemeProvider>
);

export const queryClientDecorator = Story => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

export const authorizedUserDecorator = Story => (
  <AuthorizedUserContext.Provider
    value={{
      organisaatiot: [],
    }}
  >
    <Story />
  </AuthorizedUserContext.Provider>
);

export const routerDecorator = Story => (
  <MemoryRouter initialEntries={['/']}>
    <Story />
  </MemoryRouter>
);
