import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import LanguageSelect from './index';
import {
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

storiesOf('LanguageSelect', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <LanguageSelect onChange={action('change')} />)
  .add('With translation', () => (
    <LanguageSelect onChange={action('change')} language="en" />
  ));
