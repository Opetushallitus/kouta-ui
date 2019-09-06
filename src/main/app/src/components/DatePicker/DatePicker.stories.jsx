import React from 'react';
import { storiesOf } from '@storybook/react';

import DatePicker from './index';
import { makeLocalisationDecorator } from '../../storybookUtils';

storiesOf('DatePicker', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => <DatePicker value={new Date()} />)
