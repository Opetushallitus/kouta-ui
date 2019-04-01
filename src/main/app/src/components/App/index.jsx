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

const SpinContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

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
        <PersistGate persistor={persistor} loading={null}>
          <LocalisationProvider i18n={localisation}>
            <ThemeProvider theme={theme}>
              <HttpContext.Provider value={httpClient}>
                <UrlContext.Provider value={urls}>
                  <Suspense
                    fallback={
                      <SpinContainer>
                        <Spin size="large" />
                      </SpinContainer>
                    }
                  >
                    <MainPage history={history} />
                  </Suspense>
                </UrlContext.Provider>
              </HttpContext.Provider>
            </ThemeProvider>
          </LocalisationProvider>
        </PersistGate>
      </Provider>
      <GlobalStyle />
    </>
  );
};

export default App;
