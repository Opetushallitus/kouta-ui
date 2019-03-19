import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './components/App';
import createStore from './state';
import defaultTheme from './theme';
import configureUrls from './apiUrls';
import { urls as ophUrls } from 'oph-urls-js';
import axios from 'axios';
import createBrowserHistory from 'history/createBrowserHistory';
import createLocalisation from './localisation';
import { getLocalisation } from './apiUtils';

const history = createBrowserHistory({ basename: 'kouta' });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

(async () => {
  const httpClient = axios.create({});
  const apiUrls = await configureUrls(ophUrls);

  const localisationResources = await getLocalisation({
    category: 'kouta',
    httpClient,
    apiUrls,
  });

  const localisationInstance = await createLocalisation({
    resources: localisationResources,
    debug: process.env.NODE_ENV === 'development',
  });

  const { store, persistor } = createStore({
    apiUrls,
    httpClient,
    history,
    localisation: localisationInstance,
  });

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
