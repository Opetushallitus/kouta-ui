import React from 'react';

import Collapse from '../../components/Collapse';
import { mountWithTheme, setMockDate } from '../../testUtils';

let clearMockDate;

beforeAll(() => {
  clearMockDate = setMockDate(new Date(1553161674015));
});

test('renders correctly', () => {
  const footer = <button>Footer button</button>;

  const textHeader = 'Text header';

  const elementHeader = <div>Element header</div>;

  const children = <div>Collapse children</div>;

  expect(
    mountWithTheme(
      <Collapse
        footer={footer}
        header={textHeader}
        open={true}
        onToggle={() => {}}
      >
        {children}
      </Collapse>,
    ),
  ).toMatchSnapshot();

  expect(
    mountWithTheme(
      <Collapse
        footer={footer}
        header={elementHeader}
        open={true}
        onToggle={() => {}}
      >
        {children}
      </Collapse>,
    ),
  ).toMatchSnapshot();
});

test('renders correctly when closed', () => {
  expect(
    mountWithTheme(
      <Collapse
        footer={<div>footer</div>}
        header="Header"
        open={false}
        onToggle={() => {}}
      >
        <div>Hello world!</div>
      </Collapse>,
    ),
  ).toMatchSnapshot();
});

afterAll(() => {
  clearMockDate();
});
