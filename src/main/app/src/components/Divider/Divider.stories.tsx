import React from 'react';
import { storiesOf } from '@storybook/react';

import Divider from './index';

storiesOf('Divider', module).add('Basic', () => (
  <div>
    Hello
    <Divider marginTop={2} marginBottom={2} />
    World
  </div>
));
