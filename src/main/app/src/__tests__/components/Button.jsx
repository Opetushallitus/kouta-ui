import React from 'react';
import { mount } from 'enzyme';

import Button from '../../components/Button';
import { mountWithTheme } from '../../testUtils';

test('renders correctly with variant', () => {
  expect(
    mountWithTheme(<Button variant="contained">Contained button</Button>),
  ).toMatchSnapshot();

  expect(
    mountWithTheme(<Button variant="outlined">Outlined button</Button>),
  ).toMatchSnapshot();
});

test('renders correctly with color', () => {
  expect(
    mountWithTheme(<Button color="primary">Primary button</Button>),
  ).toMatchSnapshot();

  expect(
    mountWithTheme(<Button color="secondary">Secondary button</Button>),
  ).toMatchSnapshot();
});
