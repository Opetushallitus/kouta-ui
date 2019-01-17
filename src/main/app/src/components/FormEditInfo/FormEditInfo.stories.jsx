import React from 'react';
import { storiesOf } from '@storybook/react';

import FormEditInfo from './index';

storiesOf('FormEditInfo', module).add('Basic', () => (
  <FormEditInfo
    editor="John Doe"
    date={new Date(1547205166507)}
    historyUrl="https://google.fi"
  />
));
