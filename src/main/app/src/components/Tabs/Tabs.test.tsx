import React from 'react';

import Tabs, { Tab } from './index';
import { mountWithTheme } from '#/src/testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(
      <Tabs value="b">
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <Tab value="c">Tab C</Tab>
      </Tabs>
    )
  ).toMatchSnapshot();
});
