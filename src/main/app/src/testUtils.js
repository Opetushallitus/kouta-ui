import React from 'react';
import { shallow, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';

import defaultTheme from './theme';

const makeFnWithTheme = fn => tree => {
  return fn(<ThemeProvider theme={defaultTheme}>{tree}</ThemeProvider>);
};

export const shallowWithTheme = makeFnWithTheme(shallow);

export const mountWithTheme = makeFnWithTheme(mount);
