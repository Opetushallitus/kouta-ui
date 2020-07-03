import React from 'react';
import { storiesOf } from '@storybook/react';

import Icon from './index';

storiesOf('Icon', module).add('Basic', () => (
  <>
    <Icon type="done" />
    <Icon type="add" />
  </>
));
