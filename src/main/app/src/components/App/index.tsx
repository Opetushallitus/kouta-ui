import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';

import FullSpin from '../FullSpin';
import GlobalStyle from '../GlobalStyle';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import MainPage from '../MainPage';
import LocalisationProvider from '../LocalisationProvider';
import VirkailijaRaamit from '../VirkailijaRaamit';
import UserGate from '../UserGate';
import HttpErrorNotifier from '../HttpErrorNotifier';
import ErrorBoundaryNotifier from '../ErrorBoundaryNotifier';

const App = ({
  store,
  theme,
  httpClient,
  urls,
  history,
  localisation,
  persistor,
}) => {
  return (
    <Provider store={store}>
      <LocalisationProvider i18n={localisation}>
        <ThemeProvider theme={theme}>
          <PersistGate
            persistor={persistor}
            loading={<FullSpin size="large" />}
          >
            <HttpContext.Provider value={httpClient}>
              <UrlContext.Provider value={urls}>
                <GlobalStyle />
                <Suspense fallback={<FullSpin size="large" />}>
                  <ErrorBoundaryNotifier>
                    <VirkailijaRaamit />
                    <UserGate fallback={<FullSpin size="large" />}>
                      <HttpErrorNotifier />
                      <MainPage history={history} />
                    </UserGate>
                  </ErrorBoundaryNotifier>
                </Suspense>
              </UrlContext.Provider>
            </HttpContext.Provider>
          </PersistGate>
        </ThemeProvider>
      </LocalisationProvider>
    </Provider>
  );
};

export default App;
