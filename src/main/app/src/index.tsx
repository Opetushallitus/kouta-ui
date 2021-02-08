import 'core-js/es';

import React from 'react';

import { createBrowserHistory } from 'history';
import { urls as ophUrls } from 'oph-urls-js';
import ReactDOM from 'react-dom';

import createHttpClient from './httpClient';
import { createDefaultLocalization } from './localization';
import App from './pages/App';
import { createStore } from './state';
import defaultTheme from './theme';
import { configure as configureUrls } from './urls';

const history = createBrowserHistory({ basename: 'kouta' });

(async () => {
  let apiUrls = ophUrls;

  let httpClient = createHttpClient({
    apiUrls,
    callerId: process.env.REACT_APP_CALLER_ID,
  });

  apiUrls = await configureUrls(apiUrls, httpClient);

  const localizationInstance = createDefaultLocalization({
    httpClient,
    apiUrls,
  });

  const { store, persistor } = createStore({
    apiUrls,
    httpClient,
    history,
    localization: localizationInstance,
  });

  ReactDOM.render(
    <App
      store={store}
      theme={defaultTheme}
      urls={apiUrls}
      httpClient={httpClient}
      history={history}
      localization={localizationInstance}
      persistor={persistor}
    />,
    document.getElementById('root')
  );
})();
