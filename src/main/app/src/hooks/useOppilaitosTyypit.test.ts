import _fp from 'lodash/fp';

import {
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  EI_TUETUT_KOULUTUSTYYPIT,
  ENTITY,
  ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT,
} from '#/src/constants';

import { createIsKoulutustyyppiDisabledGetter } from './useOppilaitosTyypit';

const getIsDisabledForOPH = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: true,
  oppilaitostyypit: [],
  entityType: ENTITY.KOULUTUS,
});

const getIsDisabledForOppilaitostyypit = oppilaitostyypit => {
  return createIsKoulutustyyppiDisabledGetter({
    isOphVirkailija: false,
    oppilaitostyypit,
    entityType: ENTITY.KOULUTUS,
  });
};

const getIsDisabledForAll = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: false,
  oppilaitostyypit: [],
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

test.each(ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT)(
  'Koulutustyyppis that only OPH creates should be disabled for others',
  kt => {
    expect(getIsDisabledForAll(kt)).toEqual(true);
  }
);

test.each(
  _fp.difference(KOULUTUSTYYPIT)(
    _fp.union(EI_TUETUT_KOULUTUSTYYPIT)(
      ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT
    )
  )
)(
  'Should not disable any koulutustyyppi when not detecting any oppilaitos types',
  kt => {
    expect(getIsDisabledForNone(kt)).toEqual(false);
  }
);

test('Should disable lukiokoulutus for any oppilaitostyyppi', () => {
  expect(
    getIsDisabledForOppilaitostyypit([
      'oppilaitostyyppi_15',
      'oppilaitostyyppi_42',
    ])(KOULUTUSTYYPPI.LUKIOKOULUTUS)
  ).toEqual(true);
});

test('Should enable amk-koulutustyyppi for amk-oppilaitostyyppi', () => {
  expect(
    getIsDisabledForOppilaitostyypit(['oppilaitostyyppi_41'])(
      KOULUTUSTYYPPI.AMKKOULUTUS
    )
  ).toEqual(false);
});

test('Should enable yo-koulutustyyppi for all yo-oppilaitostyyppi', () => {
  expect(
    getIsDisabledForOppilaitostyypit(['oppilaitostyyppi_42'])(
      KOULUTUSTYYPPI.YLIOPISTOKOULUTUS
    )
  ).toEqual(false);
});

test('Should disable ammatillinen koulutustyyppi for amm-oppilaitostyyppi', () => {
  expect(
    getIsDisabledForOppilaitostyypit(['oppilaitostyyppi_21'])(
      KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
    )
  ).toEqual(true);
});

test('Should enable amm. tutkinnon osa for amm koulutustyyppi', () => {
  expect(
    getIsDisabledForOppilaitostyypit(['oppilaitostyyppi_21'])(
      KOULUTUSTYYPPI.TUTKINNON_OSA
    )
  ).toEqual(false);
});

test('Should enable amm. osaamisala for amm koulutustyyppi', () => {
  expect(
    getIsDisabledForOppilaitostyypit(['oppilaitostyyppi_21'])(
      KOULUTUSTYYPPI.OSAAMISALA
    )
  ).toEqual(false);
});