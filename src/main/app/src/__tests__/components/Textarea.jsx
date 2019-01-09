import React from 'react';

import Textarea from '../../components/Textarea';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(mountWithTheme(<Textarea />)).toMatchSnapshot();
});
