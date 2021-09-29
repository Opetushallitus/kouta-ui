import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithTheme } from '#/src/testUtils';

import { IntegerInput } from './index';

test.each([
  ['', '0'],
  ['asdf', '0'],
  ['123asdf', '100'],
  ['asdfasdf12324535', '0'],
  ['12,3', '12'],
  ['123423424', '100'],
  ['-423423', '-100'],
  ['0001', '1'],
])(
  'Input value "%s" should change to "%s" on blur when min="-100" and max="100"',
  (inputValue, parsedValue) => {
    // defaultValue is 0 by default
    renderWithTheme(<IntegerInput min={-100} max={100} />);
    const inputEl = screen.getByRole('textbox');
    userEvent.clear(inputEl);
    if (inputValue !== '') {
      userEvent.type(inputEl, inputValue);
    }
    userEvent.click(document.body); // click outside the input element to blur
    expect(inputEl).toHaveValue(parsedValue);
  }
);
