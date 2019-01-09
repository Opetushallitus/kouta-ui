import React from 'react';

import Radio, { RadioGroup } from '../../components/Radio';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(
      <RadioGroup value="b" onChange={() => {}}>
        <Radio value="a">Radio A</Radio>
        <Radio value="b">Radio B</Radio>
        <Radio value="c">Radio C</Radio>
      </RadioGroup>,
    ),
  ).toMatchSnapshot();
});
