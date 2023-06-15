import React from 'react';

import { screen } from '@testing-library/react';

import { KOULUTUSTYYPPI } from '#/src/constants';
import { renderWithProviders } from '#/src/testUtils';

import { HakeutumisTaiIlmoittautumistapaSection } from './HakeutumisTaiIlmoittautumistapaSection';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: str => str,
  }),
}));

test('show info text if hakukohteet are obligatory for toteutus', () => {
  renderWithProviders(
    <HakeutumisTaiIlmoittautumistapaSection
      language="fi"
      koulutustyyppi={KOULUTUSTYYPPI.AMKKOULUTUS}
    />,
    {}
  );

  expect(
    screen.getByText('toteutuslomake.hakukohteetKaytossaInfo')
  ).toBeDefined();
});
