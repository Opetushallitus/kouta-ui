import { KOULUTUSTYYPPI } from '#/src/constants';

import { isApurahaVisible } from './toteutusVisibilities';

test.each([
  [KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS, [], false],
  [KOULUTUSTYYPPI.AMKKOULUTUS, [], false],
  [
    KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
    ['oppilaitoksenopetuskieli_4#1'],
    false,
  ],

  [KOULUTUSTYYPPI.AMKKOULUTUS, ['oppilaitoksenopetuskieli_4#1'], true],
])('isApurahaVisible', (tyyppi, languages, expected) =>
  expect(isApurahaVisible(tyyppi, languages)).toEqual(expected)
);
