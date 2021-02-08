import { KOULUTUSTYYPPI } from '#/src/constants';

import { isStipendiVisible } from './toteutusVisibilities';

test.each([
  [KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS, [], false],
  [KOULUTUSTYYPPI.AMKKOULUTUS, [], false],
  [
    KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
    ['oppilaitoksenopetuskieli_4#1'],
    false,
  ],

  [KOULUTUSTYYPPI.AMKKOULUTUS, ['oppilaitoksenopetuskieli_4#1'], true],
])('isStipendiVisible', (tyyppi, languages, expected) =>
  expect(isStipendiVisible(tyyppi, languages)).toEqual(expected)
);
