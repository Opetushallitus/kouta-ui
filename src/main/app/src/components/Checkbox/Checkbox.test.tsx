import React from 'react';

import Checkbox from './index';
import { mountWithTheme } from '#/src/testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(<Checkbox onChange={() => {}}>Checkbox</Checkbox>)
  ).toMatchSnapshot();
});
