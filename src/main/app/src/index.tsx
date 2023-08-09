import React from 'react';

import { Globals } from '@react-spring/web';
import { inspect } from '@xstate/inspect';
import { createBrowserHistory } from 'history';
import { urls as ophUrls } from 'oph-urls-js';
import ReactDOM from 'react-dom';

import createHttpClient from './httpClient';
import { createDefaultLocalization } from './localization';
import App from './pages/App';
import { createStore } from './state';
import defaultTheme from './theme';
import { configure as configureUrls } from './urls';
import { isPlaywright } from './utils';

Globals.assign({
  skipAnimation: isPlaywright,
});

if (import.meta.env.VITE_XSTATE_INSPECTOR) {
  inspect({
    iframe: false, // open in new window
  });
}

const history = createBrowserHistory({ basename: 'kouta' });

(async () => {
  let apiUrls = ophUrls;

  const httpClient = createHttpClient({
    apiUrls,
    callerId: import.meta.env.VITE_CALLER_ID,
  });

  apiUrls = await configureUrls(apiUrls, httpClient);

  const localizationInstance = await createDefaultLocalization({
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
