import React from 'react';
import { storiesOf } from '@storybook/react';

import DatePicker from './index';
import { makeLocalizationDecorator } from '#/src/storybookUtils';

storiesOf('DatePicker', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <DatePicker value={new Date()} />);
