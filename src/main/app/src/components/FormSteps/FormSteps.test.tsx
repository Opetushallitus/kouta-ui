import { ENTITY } from '#/src/constants';
import { mountWithTheme } from '#/src/testUtils';

import FormSteps from './index';

test('renders correctly', () => {
  expect(
    mountWithTheme(<FormSteps activeStep={ENTITY.HAKUKOHDE} />)
  ).toMatchSnapshot();
});
