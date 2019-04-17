import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import '@storybook/addon-actions/register';
import { ThemeProvider } from 'styled-components';

import defaultTheme from '../src/theme';
import { makeLocalisationDecorator } from '../src/storybookUtils';

const themeDecorator = storyFn => (
  <ThemeProvider theme={defaultTheme}>{storyFn()}</ThemeProvider>
);

addDecorator(themeDecorator);
addDecorator(makeLocalisationDecorator());

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  requireAll(require.context('../src', true, /stories\.jsx?$/));
}

configure(loadStories, module);
