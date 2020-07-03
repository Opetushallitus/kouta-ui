import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { makeLocalizationDecorator } from '#/src/storybookUtils';
import ErrorAlert from './index';

storiesOf('ErrorAlert', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <ErrorAlert onReload={action('reload')} />)
  .add('With center', () => <ErrorAlert onReload={action('reload')} center />);
