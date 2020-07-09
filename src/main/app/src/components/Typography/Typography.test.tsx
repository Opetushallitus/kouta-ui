import React from 'react';

import Typography from './index';
import { mountWithTheme } from '#/src/testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(<Typography>Hello world!</Typography>)
  ).toMatchSnapshot();
});

test('renders correctly with variant', () => {
  expect(
    mountWithTheme(
      <>
        <Typography variant="body">Body</Typography>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
      </>
    )
  ).toMatchSnapshot();
});
