import React from 'react';

import { action } from '@storybook/addon-actions';

import LanguageSelect from './index';

export default {
  title: 'LanguageSelect',
};

export const Basic = () => <LanguageSelect onChange={action('change')} />;

export const WithTranslation = () => (
  <LanguageSelect onChange={action('change')} language="en" />
);

WithTranslation.storyName = 'With translation';
