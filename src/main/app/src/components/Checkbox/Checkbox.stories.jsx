import React from 'react';
import { storiesOf } from '@storybook/react';

import Checkbox from './index';

storiesOf('Checkbox', module).add('Basic', () => (
  <Checkbox checked={true}>Checkbox</Checkbox>
));
