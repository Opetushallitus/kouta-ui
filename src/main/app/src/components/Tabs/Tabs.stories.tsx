import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Tabs, { Tab } from './index';

storiesOf('Tabs', module).add('Basic', () => (
  <div style={{ borderBottom: '1px solid #999999' }}>
    <Tabs value="b" onChange={action('change')}>
      <Tab value="a">Tab A</Tab>
      <Tab value="b">Tab B</Tab>
      <Tab value="c">Tab C</Tab>
    </Tabs>
  </div>
));
