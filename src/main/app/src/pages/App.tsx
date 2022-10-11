import React, { Suspense } from 'react';

import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import ErrorBoundaryNotifier from '#/src/components/ErrorBoundaryNotifier';
import FullSpin from '#/src/components/FullSpin';
import GlobalStyle from '#/src/components/GlobalStyle';
import HttpErrorNotifier from '#/src/components/HttpErrorNotifier';
import { GlobalTooltipStyles } from '#/src/components/Tooltip/TooltipGlobalStyles';
import VirkailijaRaamit from '#/src/components/VirkailijaRaamit';
import HttpContext from '#/src/contexts/HttpClientContext';
import UrlContext from '#/src/contexts/UrlContext';
import { UserGate } from '#/src/pages/UserGate';
import { isDev } from '#/src/utils';

import Routes from './Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const App = ({
  store,
  theme,
  httpClient,
  urls,
  history,
  localization,
  persistor,
}) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
      <I18nextProvider i18n={localization}>
        <ThemeProvider theme={theme}>
          <PersistGate
            persistor={persistor}
            loading={<FullSpin size="large" />}
          >
            <HttpContext.Provider value={httpClient}>
              <UrlContext.Provider value={urls}>
                <GlobalStyle />
                <GlobalTooltipStyles />
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
    </QueryClientProvider>
  </Provider>
);

export default App;
