import React from 'react';

import Textarea from './index';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(mountWithTheme(<Textarea />)).toMatchSnapshot();
});
