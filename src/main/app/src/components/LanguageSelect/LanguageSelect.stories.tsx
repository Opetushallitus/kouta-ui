import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import {
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

import LanguageSelect from './index';

storiesOf('LanguageSelect', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <LanguageSelect onChange={action('change')} />)
  .add('With translation', () => (
    <LanguageSelect onChange={action('change')} language="en" />
  ));
