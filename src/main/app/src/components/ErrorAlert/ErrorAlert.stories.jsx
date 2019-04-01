import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { makeLocalisationDecorator } from '../../storybookUtils';
import ErrorAlert from './index';

storiesOf('ErrorAlert', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => <ErrorAlert onReload={action('reload')} />)
  .add('With center', () => <ErrorAlert onReload={action('reload')} center />);
