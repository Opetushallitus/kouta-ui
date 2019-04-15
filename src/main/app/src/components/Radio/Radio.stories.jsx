import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Radio, { RadioGroup } from './index';

storiesOf('Radio', module)
  .add('Basic', () => (
    <>
    <Radio value="radioA" onChange={action('change')}>Radio A</Radio>
    <Radio value="radioB" onChange={action('change')}>Radio B</Radio>
    </>
  ))
  .add('With disabled', () => <Radio checked={true} disabled>Radio</Radio>)
  .add('With radio group', () => (
    <RadioGroup value="b" onChange={action('change')}>
      <Radio value="a">Radio A</Radio>
      <Radio value="b">Radio B</Radio>
      <Radio value="c">Radio C</Radio>
    </RadioGroup>
  ))
  .add('With radio group options prop', () => (
    <RadioGroup
      options={[
        { value: 'a', label: 'Radio A' },
        { value: 'b', label: 'Radio B' },
        { value: 'c', label: 'Radio C' },
      ]}
      onChange={action('change')}
    />
  ));
