import React from 'react';
import { shallow } from 'enzyme';
import { createStore } from 'redux';

import App from './index';

const store = createStore((state = 0, action) => state);

test('Renders correctly', () => {
  expect(shallow(<App store={store} theme={{}} />)).toMatchSnapshot();
});
