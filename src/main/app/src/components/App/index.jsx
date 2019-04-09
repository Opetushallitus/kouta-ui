import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import styled from 'styled-components';

import Spin from '../Spin';
import GlobalStyle from '../GlobalStyle';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import MainPage from '../MainPage';
import LocalisationProvider from '../LocalisationProvider';
import VirkailijaRaamit from '../VirkailijaRaamit';
import UserGate from '../UserGate';

const SpinContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CenterSpin = () => (
  <SpinContainer>
    <Spin size="large" />
  </SpinContainer>
);

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
    <>
      <Provider store={store}>
        <LocalisationProvider i18n={localisation}>
          <ThemeProvider theme={theme}>
            <PersistGate persistor={persistor} loading={<CenterSpin />}>
              <HttpContext.Provider value={httpClient}>
                <UrlContext.Provider value={urls}>
                  <Suspense fallback={<CenterSpin />}>
                    <VirkailijaRaamit />
                    <UserGate fallback={<CenterSpin />}>
                      <MainPage history={history} />
                    </UserGate>
                  </Suspense>
                </UrlContext.Provider>
              </HttpContext.Provider>
            </PersistGate>
          </ThemeProvider>
        </LocalisationProvider>
      </Provider>
      <GlobalStyle />
    </>
  );
};

export default App;
