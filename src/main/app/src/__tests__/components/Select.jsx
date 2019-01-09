import React from 'react';

import Select, { Option } from '../../components/Select';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(
      <Select value="b" onChange={() => {}}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
        <Option value="c">Option C</Option>
      </Select>,
    ),
  ).toMatchSnapshot();
});
