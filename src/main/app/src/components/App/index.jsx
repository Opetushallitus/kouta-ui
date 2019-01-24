import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from '../GlobalStyle';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import MainPage from '../MainPage';
import LocalisationProvider from '../LocalisationProvider';

const App = ({ store, theme, httpClient, urls, history, localisation }) => {
  return (
    <>
      <Provider store={store}>
        <LocalisationProvider i18n={localisation}>
          <ThemeProvider theme={theme}>
            <HttpContext.Provider value={httpClient}>
              <UrlContext.Provider value={urls}>
                <MainPage history={history} />
              </UrlContext.Provider>
            </HttpContext.Provider>
          </ThemeProvider>
        </LocalisationProvider>
      </Provider>
      <GlobalStyle />
    </>
  );
};

export default App;
