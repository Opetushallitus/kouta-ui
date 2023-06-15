import React, { PropsWithChildren } from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { createRootReducer } from './state/rootReducer';
import defaultTheme from './theme';

const makeFnWithTheme = fn => tree => {
  return fn(<ThemeProvider theme={defaultTheme}>{tree}</ThemeProvider>);
};

export const renderWithTheme = makeFnWithTheme(render);

export const mountWithTheme = tree => {
  const { container } = makeFnWithTheme(render)(tree);
  return container.firstChild;
};

export const setMockDate = date => {
  const _Date = Date;

  global.Date.now = () => Number(date);

  return () => {
    global.Date = _Date;
  };
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: createRootReducer({}), preloadedState }),
    ...renderOptions
  }
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
