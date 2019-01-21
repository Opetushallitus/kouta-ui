import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Anchor from './index';

storiesOf('Anchor', module).add('Basic', () => (
  <Anchor href="https://google.fi">
    Link to google
  </Anchor>
));
