import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './components/App';
import createStore from './state';
import defaultTheme from './theme';
import configureUrls from './apiUrls';
import { urls as ophUrls } from 'oph-urls-js';
import axios from 'axios';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

(async () => {
  const httpClient = axios.create({});
  const apiUrls = await configureUrls(ophUrls);

  const store = createStore({ apiUrls, httpClient });

  ReactDOM.render(
    <App
      store={store}
      theme={defaultTheme}
      urls={apiUrls}
      httpClient={httpClient}
    />,
    document.getElementById('root'),
  );
})();
