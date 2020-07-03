import React from 'react';

import Input from './index';
import { mountWithTheme } from '#/src/testUtils';

test('renders correctly', () => {
  expect(mountWithTheme(<Input />)).toMatchSnapshot();
});
