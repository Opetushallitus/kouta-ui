import React from 'react';

import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

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

export * from '@testing-library/react';
