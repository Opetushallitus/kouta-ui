import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';

import FullSpin from '#/src/components/FullSpin';
import GlobalStyle from '#/src/components/GlobalStyle';
import HttpContext from '#/src/contexts/HttpClientContext';
import UrlContext from '#/src/contexts/UrlContext';
import VirkailijaRaamit from '#/src/components/VirkailijaRaamit';
import UserGate from '#/src/pages/UserGate';
import HttpErrorNotifier from '#/src/components/HttpErrorNotifier';
import ErrorBoundaryNotifier from '#/src/components/ErrorBoundaryNotifier';
import Routes from './Routes';

const App = ({
  store,
  theme,
  httpClient,
  urls,
  history,
  localization,
  persistor,
}) => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={localization}>
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
                      <Routes history={history} />
                    </UserGate>
                  </ErrorBoundaryNotifier>
                </Suspense>
              </UrlContext.Provider>
            </HttpContext.Provider>
          </PersistGate>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
