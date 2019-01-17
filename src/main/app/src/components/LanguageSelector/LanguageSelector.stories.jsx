import React from 'react';
import { storiesOf } from '@storybook/react';

import LanguageSelector from './index';

const languages = [
  { label: 'Suomeksi', value: 'fi' },
  { label: 'Ruotsiksi', value: 'se' },
  { label: 'Englanniksi', value: 'en' },
];

storiesOf('LanguageSelector', module).add('Basic', () => (
  <LanguageSelector languages={languages} defaultValue="fi">
    {({ value }) => value}
  </LanguageSelector>
));
