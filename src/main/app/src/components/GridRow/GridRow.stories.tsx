import React from 'react';
import { storiesOf } from '@storybook/react';

import GridRow from './index';
import GridColumn from '../GridColumn';

storiesOf('GridRow', module).add('Basic', () => (
  <GridRow gutter={2}>
    <GridColumn sm={6} md={3}>
      Column 1
    </GridColumn>
    <GridColumn sm={6} md={3}>
      Column 2
    </GridColumn>
    <GridColumn sm={6} md={3}>
      Column 3
    </GridColumn>
    <GridColumn ms={6} md={3}>
      Column 4
    </GridColumn>
  </GridRow>
));
