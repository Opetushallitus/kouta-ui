import 'core-js/es';

import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { urls as ophUrls } from 'oph-urls-js';

import { createDefaultLocalisation } from './localisation';

import App from './components/App';
import createStore from './state';
import defaultTheme from './theme';
import configureUrls from './apiUrls';

import createHttpClient from './httpClient';

const history = createBrowserHistory({ basename: 'kouta' });

(async () => {
  let apiUrls = ophUrls;

  let httpClient = createHttpClient({
    apiUrls,
    callerId: process.env.REACT_APP_CALLER_ID,
  });

  apiUrls = await configureUrls(ophUrls, httpClient);

  const localisationInstance = createDefaultLocalisation({
    httpClient,
    apiUrls,
  });

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
