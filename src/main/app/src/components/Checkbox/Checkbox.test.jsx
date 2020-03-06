import React from 'react';

import Checkbox from './index';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(<Checkbox onChange={() => {}}>Checkbox</Checkbox>),
  ).toMatchSnapshot();
});
