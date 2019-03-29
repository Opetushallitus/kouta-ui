import React from 'react';
import { storiesOf } from '@storybook/react';

import { makeLocalisationDecorator } from '../../storybookUtils';
import FormEditInfo from './index';

storiesOf('FormEditInfo', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => (
    <FormEditInfo
      editor="John Doe"
      date="2011-10-10T10:30"
      historyUrl="https://google.fi"
    />
  ));
