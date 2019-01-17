import React from 'react';

import FormSteps from '../../components/FormSteps';
import { mountWithTheme } from '../../testUtils';

test('renders correctly', () => {
  expect(
    mountWithTheme(<FormSteps activeStep="hakukohde" />),
  ).toMatchSnapshot();
});
