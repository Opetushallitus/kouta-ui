import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Radio, { RadioGroup } from './index';

storiesOf('Radio', module)
  .add('Basic', () => <Radio checked={true}>Radio</Radio>)
  .add('With radio group', () => (
    <RadioGroup value="b" onChange={action('change')}>
      <Radio value="a">Radio A</Radio>
      <Radio value="b">Radio B</Radio>
      <Radio value="c">Radio C</Radio>
    </RadioGroup>
  ));
