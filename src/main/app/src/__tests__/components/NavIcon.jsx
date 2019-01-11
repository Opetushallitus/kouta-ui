import React from 'react';

import NavIcon from '../../components/NavIcon';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(<NavIcon icon="settings">Settings</NavIcon>),
  ).toMatchSnapshot();
});

test('renders correctly with state', () => {
  expect(
    mountWithTheme(
      <NavIcon icon="settings" active>
        Settings active
      </NavIcon>,
    ),
  ).toMatchSnapshot();

  expect(
    mountWithTheme(
      <NavIcon icon="settings" done>
        Settings done
      </NavIcon>,
    ),
  ).toMatchSnapshot();
});
