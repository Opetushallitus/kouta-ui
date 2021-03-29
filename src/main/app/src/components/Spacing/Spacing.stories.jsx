import React from 'react';

import { storiesOf } from '@storybook/react';

import Spacing from './index';

storiesOf('Spacing', module).add('Basic', () => (
  <>
    <Spacing marginTop={1} marginBottom={2} marginLeft={3} marginRight={4}>
      Margin
    </Spacing>
    <Spacing paddingTop={1} paddingBottom={2} paddingLeft={3} paddingRight={4}>
      Padding
    </Spacing>
  </>
));
