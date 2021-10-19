import _fp from 'lodash/fp';

import {
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  EI_TUETUT_KOULUTUSTYYPIT,
  ENTITY,
} from '#/src/constants';

import { createIsKoulutustyyppiDisabledGetter } from './useOppilaitosTyypit';

const getIsDisabledForOPH = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: true,
  oppilaitostyypit: [],
  entityType: ENTITY.KOULUTUS,
});

const getIsDisabledForAll = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: false,
  oppilaitostyypit: [
    'oppilaitostyyppi_15',
    'oppilaitostyyppi_21',
    'oppilaitostyyppi_41',
  ],
  entityType: ENTITY.KOULUTUS,
});

const getIsDisabledForNone = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: false,
  oppilaitostyypit: [],
  entityType: ENTITY.KOULUTUS,
});

test.each(_fp.difference(KOULUTUSTYYPIT)(EI_TUETUT_KOULUTUSTYYPIT))(
  'Creating KOMO with any koulutustyyppi should be allowed for OPH',
  kt => {
    expect(getIsDisabledForOPH(kt)).toEqual(false);
  }
);

test.each(_fp.difference(KOULUTUSTYYPIT)(EI_TUETUT_KOULUTUSTYYPIT))(
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
  expect(getIsDisabledForAll(KOULUTUSTYYPPI.MUUT_KOULUTUKSET)).toEqual(true);
});
