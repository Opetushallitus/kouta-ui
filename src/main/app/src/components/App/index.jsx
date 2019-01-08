import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import MainPage from '../MainPage';

const App = ({ store, theme }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MainPage />
      </ThemeProvider>
    </Provider>
  );
};

export default App;