import React from 'react';

import Input from '../../components/Input';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(mountWithTheme(<Input />)).toMatchSnapshot();
});
