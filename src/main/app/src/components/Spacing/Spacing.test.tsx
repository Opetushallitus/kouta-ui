import React from 'react';

import { mountWithTheme } from '#/src/testUtils';

import Spacing from './index';

test('renders correctly', () => {
  expect(
    mountWithTheme(
      <>
        <Spacing marginLeft={1} marginRight={2} marginBottom={3} marginTop={4}>
          With margins
        </Spacing>
        <Spacing
          paddingLeft={1}
          paddingRight={2}
          paddingBottom={3}
          paddingTop={4}
        >
          With paddings
        </Spacing>
      </>
    )
  ).toMatchSnapshot();
});
