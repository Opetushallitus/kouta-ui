import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from '../GlobalStyle';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import MainPage from '../MainPage';

const App = ({ store, theme, httpClient, urls }) => {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <HttpContext.Provider value={httpClient}>
            <UrlContext.Provider value={urls}>
              <MainPage />
            </UrlContext.Provider>
          </HttpContext.Provider>
        </ThemeProvider>
      </Provider>
      <GlobalStyle />
    </>
  );
};

export default App;
