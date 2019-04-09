import 'core-js/features/object/keys';
import 'core-js/features/object/values';
import 'core-js/features/promise';
import 'core-js/features/array/includes';

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import createBrowserHistory from 'history/createBrowserHistory';
import { urls as ophUrls } from 'oph-urls-js';
import get from 'lodash/get';
import merge from 'lodash/merge';

import * as serviceWorker from './serviceWorker';
import App from './components/App';
import createStore from './state';
import defaultTheme from './theme';
import configureUrls from './apiUrls';
import createLocalisation from './localisation';
import { getLocalisation } from './apiUtils';
import getTranslations from './translations';

const history = createBrowserHistory({ basename: 'kouta' });

serviceWorker.unregister();

const loadLocalisation = async ({
  namespace,
  language,
  httpClient,
  apiUrls,
}) => {
  const localisation = await getLocalisation({
    category: namespace,
    locale: language,
    httpClient,
    apiUrls,
  });

  const translations = getTranslations();

  return get(translations, [language, namespace])
    ? merge({}, translations[language][namespace], localisation || {})
    : localisation;
};

(async () => {
  const httpClient = axios.create({});
  const apiUrls = await configureUrls(ophUrls);

  const localisationInstance = createLocalisation({
    debug: process.env.NODE_ENV === 'development',
    loadLocalisation: ({ namespace, language }) =>
      loadLocalisation({ namespace, language, httpClient, apiUrls }),
  });

  window.__i18n__ = localisationInstance;

  const { store, persistor } = createStore({
    apiUrls,
    httpClient,
    history,
    localisation: localisationInstance,
  });

  window.__store__ = store;

  ReactDOM.render(
    <App
      store={store}
      theme={defaultTheme}
      urls={apiUrls}
      httpClient={httpClient}
      history={history}
      localisation={localisationInstance}
      persistor={persistor}
    />,
    document.getElementById('root'),
  );
})();
