import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import LanguageSelect from './index';

storiesOf('LanguageSelect', module)
  .add('Basic', () => <LanguageSelect onChange={action('change')} />)
  .add('With translation', () => (
    <LanguageSelect onChange={action('change')} language="en" />
  ));
