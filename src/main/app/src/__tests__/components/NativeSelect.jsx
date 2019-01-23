import React from 'react';

import NativeSelect, { Option } from '../../components/NativeSelect';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(
      <NativeSelect value="b" onChange={() => {}}>
        <Option value="a">Option A</Option>
        <Option value="b">Option B</Option>
        <Option value="c">Option C</Option>
      </NativeSelect>,
    ),
  ).toMatchSnapshot();
});
