import React from 'react';

import { action } from 'storybook/actions';

import LanguageSelect from './index';

export default {
  title: 'LanguageSelect',
};

export const Basic = () => <LanguageSelect onChange={action('change')} />;

export const WithTranslation = {
  render: () => <LanguageSelect onChange={action('change')} language="en" />,

  name: 'With translation',
};
