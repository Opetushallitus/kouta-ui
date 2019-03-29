import React from 'react';

import Input from './index';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(mountWithTheme(<Input />)).toMatchSnapshot();
});
