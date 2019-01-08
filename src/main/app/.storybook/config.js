import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import defaultTheme from '../src/theme';

const themeDecorator = storyFn => (
  <ThemeProvider theme={defaultTheme}>{storyFn()}</ThemeProvider>
);

addDecorator(themeDecorator);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  requireAll(require.context('../src', true, /stories\.jsx?$/));
}

configure(loadStories, module);
