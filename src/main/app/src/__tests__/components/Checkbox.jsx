import React from 'react';

import Checkbox from '../../components/Checkbox';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(mountWithTheme(<Checkbox>Checkbox</Checkbox>)).toMatchSnapshot();
});
