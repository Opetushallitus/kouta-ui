import { KOULUTUSTYYPPI } from '#/src/constants';

import { isApurahaVisible } from './toteutusVisibilities';

test.each([
  [KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS, [], 'maksuton', false],
  [KOULUTUSTYYPPI.AMKKOULUTUS, [], 'maksullinen', false],
  [
    KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
    ['oppilaitoksenopetuskieli_4#1'],
    'maksullinen',
    false,
  ],
  [
    KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
    ['oppilaitoksenopetuskieli_4#1'],
    'lukuvuosimaksu',
    false,
  ],

  [
    KOULUTUSTYYPPI.AMKKOULUTUS,
    ['oppilaitoksenopetuskieli_4#1'],
    'lukuvuosimaksu',
    true,
  ],
  [
    KOULUTUSTYYPPI.YOKOULUTUS,
    ['oppilaitoksenopetuskieli_4#1'],
    'maksuton',
    false,
  ],
])('isApurahaVisible', (tyyppi, languages, maksullisuustyyppi, expected) =>
  expect(isApurahaVisible(tyyppi, languages, maksullisuustyyppi)).toEqual(
    expected
  )
);
