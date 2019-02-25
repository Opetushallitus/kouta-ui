import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from '../GlobalStyle';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import MainPage from '../MainPage';
import LocalisationProvider from '../LocalisationProvider';

class ErrorBoundary extends Component {
  static defaultProps = {
    onCatch: () => {},
  };

  componentDidCatch(error) {
    this.props.onCatch(error);
  }

  render() {
    return this.props.children;
  }
}

const App = ({
  store,
  theme,
  httpClient,
  urls,
  history,
  localisation,
  onCatch,
}) => {
  return (
    <>
      <Provider store={store}>
        <LocalisationProvider i18n={localisation}>
          <ThemeProvider theme={theme}>
            <HttpContext.Provider value={httpClient}>
              <UrlContext.Provider value={urls}>
                <ErrorBoundary onCatch={onCatch}>
                  <MainPage history={history} />
                </ErrorBoundary>
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
