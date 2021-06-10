import { KOULUTUSTYYPIT, KOULUTUSTYYPPI } from '#/src/constants';

import { createIsKoulutustyyppiDisabledGetter } from '../useOppilaitosTyypit';

const getIsDisabledForOPH = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: true,
  isKorkeakoulutus: true,
  isAmmatillinen: true,
  isLukio: true,
});

const getIsDisabledForAll = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: false,
  isKorkeakoulutus: true,
  isAmmatillinen: true,
  isLukio: true,
});

const getIsDisabledForNone = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: false,
  isKorkeakoulutus: false,
  isAmmatillinen: false,
  isLukio: false,
});

test.each(KOULUTUSTYYPIT)(
  'Creating KOMO with any koulutustyyppi should be allowed for OPH',
  kt => {
    expect(getIsDisabledForOPH(kt)).toEqual(false);
  }
);

test.each(KOULUTUSTYYPIT)(
  'Should not disable any koulutustyyppi when not detecting any oppilaitos types',
  kt => {
    expect(getIsDisabledForNone(kt)).toEqual(false);
  }
);

test('Should disable right koulutustyyppis when having kk, amm and lukio oppilaitos types', () => {
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.LUKIOKOULUTUS)).toEqual(true);
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.AMKKOULUTUS)).toEqual(false);
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS)).toEqual(false);
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS)).toEqual(
    true
  );
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.TUTKINNON_OSA)).toEqual(false);
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.OSAAMISALA)).toEqual(false);
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.MUUT_KOULUTUKSET)).toEqual(false);
});
