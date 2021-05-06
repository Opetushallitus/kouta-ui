import React from 'react';

import { createBrowserHistory } from 'history';
import { urls as ophUrls } from 'oph-urls-js';
import qs from 'query-string';
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
  const casTicket = qs.parse(window.location.search)?.ticket;

  apiUrls = await configureUrls();

  let httpClient = await createHttpClient({
    apiUrls,
    callerId: process.env.REACT_APP_CALLER_ID,
    casTicket,
  });

  const localizationInstance = createDefaultLocalization({
    httpClient,
    apiUrls,
  });

  const { store, persistor } = createStore();

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
