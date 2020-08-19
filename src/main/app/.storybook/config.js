import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { withKnobs } from '@storybook/addon-knobs';

import defaultTheme from '#/src/theme';
import {
  makeLocalizationDecorator,
  makeStoreDecorator,
  makeApiDecorator,
} from '#/src/storybookUtils';

const themeDecorator = storyFn => (
  <ThemeProvider theme={defaultTheme}>{storyFn()}</ThemeProvider>
);

addDecorator(withKnobs);
addDecorator(themeDecorator);
addDecorator(makeLocalizationDecorator());
addDecorator(makeStoreDecorator());
addDecorator(makeApiDecorator());

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  requireAll(require.context('../src', true, /stories\.[jt]sx?$/));
}

configure(loadStories, module);
